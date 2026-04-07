/**
 * STRATEGY PATTERN
 *
 * Defines a family of algorithms, encapsulates each one, and makes them
 * interchangeable. The Strategy lets the algorithm vary independently
 * from the clients that use it.
 *
 * Key idea: instead of hardcoding one algorithm, you inject it as a
 * dependency so you can swap it at runtime without touching the caller.
 *
 * Real-world uses: payment gateways (Stripe / PayPal / crypto),
 * file compression formats, authentication methods, sorting/filtering.
 */

// ─── Strategy Interface (comment-documented contract) ─────────────────────
//
//  Every concrete strategy MUST implement:
//    execute(data: any[]): any[]
//
// ─────────────────────────────────────────────────────────────────────────

// Concrete Strategy A — Bubble Sort (simple, O(n²))
class BubbleSortStrategy {
  get name() { return 'BubbleSort' }
  get complexity() { return 'O(n²)' }

  execute(data) {
    const arr = [...data]
    const n = arr.length
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

// Concrete Strategy B — Quick Sort (fast average, O(n log n))
class QuickSortStrategy {
  get name() { return 'QuickSort' }
  get complexity() { return 'O(n log n)' }

  execute(data) {
    const arr = [...data]
    return this._quick(arr)
  }

  _quick(arr) {
    if (arr.length <= 1) return arr
    const pivot = arr[Math.floor(arr.length / 2)]
    const left  = arr.filter(x => x < pivot)
    const mid   = arr.filter(x => x === pivot)
    const right = arr.filter(x => x > pivot)
    return [...this._quick(left), ...mid, ...this._quick(right)]
  }
}

// Concrete Strategy C — Merge Sort (stable, O(n log n))
class MergeSortStrategy {
  get name() { return 'MergeSort' }
  get complexity() { return 'O(n log n) stable' }

  execute(data) {
    const arr = [...data]
    return this._merge(arr)
  }

  _merge(arr) {
    if (arr.length <= 1) return arr
    const mid   = Math.floor(arr.length / 2)
    const left  = this._merge(arr.slice(0, mid))
    const right = this._merge(arr.slice(mid))
    return this._combine(left, right)
  }

  _combine(left, right) {
    const result = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      result.push(left[i] <= right[j] ? left[i++] : right[j++])
    }
    return [...result, ...left.slice(i), ...right.slice(j)]
  }
}

// ─── Context ───────────────────────────────────────────────────────────────

class DataProcessor {
  constructor(strategy) {
    this.strategy = strategy
  }

  // Swap the algorithm at runtime — no other code changes
  setStrategy(strategy) {
    this.strategy = strategy
    console.log(`  [Strategy]   Switched to → ${strategy.name} (${strategy.complexity})`)
  }

  process(data) {
    console.log(`  [Strategy]   Running ${this.strategy.name} on [${data.join(', ')}]`)
    const start  = Date.now()
    const result = this.strategy.execute(data)
    const ms     = Date.now() - start
    console.log(`  [Strategy]   Result: [${result.join(', ')}]  in ${ms}ms`)
    return result
  }
}

module.exports = {
  DataProcessor,
  BubbleSortStrategy,
  QuickSortStrategy,
  MergeSortStrategy,
}
