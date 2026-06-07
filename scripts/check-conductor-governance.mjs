import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const root = process.cwd();
const manifestPath = resolve(root, 'openspec/conductor-governance.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const errors = [];

async function requireFile(path) {
  try {
    const info = await stat(resolve(root, path));
    if (!info.isFile()) errors.push(`${path}: expected a file`);
  } catch {
    errors.push(`${path}: missing`);
  }
}

async function requireDirectory(path) {
  try {
    const info = await stat(resolve(root, path));
    if (!info.isDirectory()) errors.push(`${path}: expected a directory`);
  } catch {
    errors.push(`${path}: missing`);
  }
}

for (const path of Object.values(manifest.authority)) await requireFile(path);

const ids = new Set();
for (const change of manifest.changes) {
  if (ids.has(change.id)) errors.push(`${change.id}: duplicate change id`);
  ids.add(change.id);
  await requireDirectory(`openspec/changes/${change.id}`);
  await requireFile(`openspec/changes/${change.id}/proposal.md`);
  await requireFile(`openspec/changes/${change.id}/tasks.md`);
  await requireDirectory(`openspec/changes/${change.id}/specs`);
}

for (const change of manifest.changes) {
  for (const dependency of change.dependsOn) {
    if (!ids.has(dependency)) {
      errors.push(`${change.id}: unknown dependency ${dependency}`);
    }
  }
}

const visiting = new Set();
const visited = new Set();
const byId = new Map(manifest.changes.map((change) => [change.id, change]));
function visit(id) {
  if (visiting.has(id)) {
    errors.push(`${id}: dependency cycle`);
    return;
  }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of byId.get(id)?.dependsOn ?? []) visit(dependency);
  visiting.delete(id);
  visited.add(id);
}
for (const id of ids) visit(id);

const invariantIds = new Set();
for (const invariant of manifest.invariants) {
  if (invariantIds.has(invariant.id)) {
    errors.push(`${invariant.id}: duplicate invariant id`);
  }
  invariantIds.add(invariant.id);
}

const agentInstructionPaths = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
const instructionHashes = [];
for (const path of agentInstructionPaths) {
  const content = await readFile(resolve(root, path));
  instructionHashes.push(createHash('sha256').update(content).digest('hex'));
}
if (new Set(instructionHashes).size !== 1) {
  errors.push('AGENTS.md, CLAUDE.md, and GEMINI.md must remain identical');
}

for (const path of ['Starter Pack/README.md', 'Starter Pack/Goal.md', 'Starter Pack/Plan.md']) {
  const content = await readFile(resolve(root, path), 'utf8');
  for (const id of ids) {
    if (!content.includes(id)) errors.push(`${path}: missing change id ${id}`);
  }
}

if (errors.length > 0) {
  console.error('Conductor governance validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Conductor governance valid: ${manifest.changes.length} changes, ${manifest.invariants.length} invariants.`,
  );
}
