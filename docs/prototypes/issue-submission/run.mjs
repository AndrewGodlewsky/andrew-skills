import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { initialState, repository, step } from './model.mjs';
import { scenarios } from './scenarios.mjs';

// This shell never imports filesystem/network/process-spawning APIs. No writes
// leave the in-memory model. --all prints design examples, not test results.
const args = process.argv.slice(2);
if (args.includes('--all')) {
  for (const fixture of scenarios) {
    let state = step(initialState(), fixture, 'submit');
    const firstCount = state.writes.length;
    state = step(state, fixture, 'submit');
    state = step(state, fixture, 'check');
    console.log(JSON.stringify({ scenario: fixture.id, request: fixture.request, firstWriteCount: firstCount, state }, null, 2));
  }
} else {
  let index = 0;
  let state = initialState();
  let view = 'result';
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      const fixture = scenarios[index];
      stdout.write('\x1b[2J\x1b[H');
      console.log('\x1b[1mTHROWAWAY DESIGN PROTOTYPE — no GitHub requests\x1b[0m');
      console.log(`${index + 1}/${scenarios.length}: ${fixture.name}`);
      console.log(`Fixed destination: ${repository}`);
      console.log(`Phase: ${state.phase} | Simulated write operations: ${state.writes.length}`);
      if (view === 'input') console.log(JSON.stringify(fixture.request, null, 2));
      else if (view === 'world') console.log(JSON.stringify(fixture.world, null, 2));
      else {
        for (const item of state.results.slice(-6)) console.log(`${item.operation}: ${item.status}\n  ${item.detail}`);
        if (!state.results.length) console.log(fixture.explanation || 'Ready to simulate this caller handoff.');
      }
      console.log('\n[s] submit/repeat  [c] reconcile  [i] input  [w] fixture world  [o] outcome');
      console.log('[n/p] next/previous  [number] scenario  [r] reset fixture  [q] quit');
      const command = (await terminal.question('> ')).trim().toLowerCase();
      if (command === 'q') break;
      if (command === 's' || command === 'c') {
        state = step(state, fixture, command === 's' ? 'submit' : 'check');
        view = 'result';
      } else if (['i', 'w', 'o'].includes(command)) view = { i: 'input', w: 'world', o: 'result' }[command];
      else if (command === 'r') state = initialState();
      else if (['n', 'p'].includes(command) || /^\d+$/.test(command)) {
        const selected = command === 'n' ? index + 1 : command === 'p' ? index - 1 : Number(command) - 1;
        index = Math.max(0, Math.min(scenarios.length - 1, selected));
        state = initialState();
        view = 'result';
      }
    }
  } finally {
    terminal.close();
  }
}
