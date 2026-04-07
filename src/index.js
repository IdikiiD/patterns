/**
 * behavioral-patterns — Node.js project
 *
 * Demonstrates 4 Behavioral Design Patterns:
 *   1. Observer              — EventEmitter / pub-sub
 *   2. Strategy              — swappable algorithms
 *   3. Command               — encapsulated actions + undo/redo
 *   4. Chain of Responsibility — middleware pipeline
 *
 * Run individual patterns:
 *   npm run observer
 *   npm run strategy
 *   npm run command
 *   npm run chain
 *
 * Run all at once:
 *   npm start
 */

function separator(title) {
  console.log('\n' + '═'.repeat(56))
  console.log(`  ${title}`)
  console.log('═'.repeat(56) + '\n')
}

separator('1 / 4 — OBSERVER')
require('./examples/observer.example')

separator('2 / 4 — STRATEGY')
require('./examples/strategy.example')

separator('3 / 4 — COMMAND')
require('./examples/command.example')

separator('4 / 4 — CHAIN OF RESPONSIBILITY')
require('./examples/chain.example')

console.log('\n' + '═'.repeat(56))
console.log('  All 4 behavioral patterns executed successfully.')
console.log('═'.repeat(56) + '\n')
