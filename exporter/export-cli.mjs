import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { acquireCatalog, checkRuntime, executePlan, makePlan } from './export-protocol.mjs';
import { checkedPath, inspectCopy, targetPaths } from './export-filesystem.mjs';
import { PROTOCOL_VERSION, requireExport } from './export-source.mjs';

export function argumentsFor(argv) {
  const { values, positionals } = parseArgs({ args: argv, allowPositionals: true, strict: true, options: {
    environment: { type: 'string' }, home: { type: 'string' }, checkout: { type: 'string' },
    'offline-cache': { type: 'string' }, cache: { type: 'string' }, skill: { type: 'string' }, commit: { type: 'string' },
    plan: { type: 'string' }, name: { type: 'string' }, 'portability-reviewed': { type: 'boolean' },
  } });
  const command = positionals[0];
  requireExport(positionals.length === 1 && ['list', 'plan', 'export', 'inspect'].includes(command), 'choose list, plan, export or inspect; see exporter/README.md');
  const allowed = { list: ['checkout', 'offline-cache'], plan: ['cache', 'skill', 'commit'],
    export: ['plan', 'portability-reviewed'], inspect: ['name'] }[command];
  requireExport(Object.keys(values).every(key => ['environment', 'home', ...allowed].includes(key)), `unsupported option for ${command}`);
  const target = { environment: values.environment, home: values.home };
  targetPaths(target);
  if (command !== 'inspect') checkRuntime();
  return { command, values, target };
}

export function runCommand(argv) {
  const { command, values, target } = argumentsFor(argv);
  if (command === 'list') return acquireCatalog({ target, checkout: values.checkout, offlineCache: values['offline-cache'] });
  if (command === 'plan') return makePlan({ target, cache: values.cache, skill: values.skill, commit: values.commit });
  if (command === 'inspect') return { protocolVersion: PROTOCOL_VERSION, ...inspectCopy({ target, personalName: values.name }) };
  requireExport(typeof values.plan === 'string', 'export requires a saved plan file');
  const plan = JSON.parse(readFileSync(checkedPath(values.plan), 'utf8').replace(/^\uFEFF/, ''));
  return executePlan({ target, plan, portabilityReviewed: values['portability-reviewed'] === true });
}
