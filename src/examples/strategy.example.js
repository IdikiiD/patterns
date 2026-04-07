const {
  DataProcessor,
  BubbleSortStrategy,
  QuickSortStrategy,
  MergeSortStrategy,
} = require('../patterns/strategy')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  STRATEGY PATTERN — Swappable Sorting Algorithms')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const data = [64, 25, 12, 22, 11, 90, 3, 47]

const processor = new DataProcessor(new BubbleSortStrategy())
console.log('  [Init]   DataProcessor created with BubbleSort\n')

console.log('  → processor.process(data)')
processor.process(data)

console.log('\n  → processor.setStrategy(new QuickSortStrategy())')
processor.setStrategy(new QuickSortStrategy())
processor.process(data)

console.log('\n  → processor.setStrategy(new MergeSortStrategy())')
processor.setStrategy(new MergeSortStrategy())
processor.process(data)

console.log('\n  [Proof]  Same data. Same result. Different algorithm each time.')
console.log('  [Proof]  The processor never changed — only the injected strategy did.\n')
