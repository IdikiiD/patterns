/**
 * OBSERVER PATTERN
 *
 * Defines a one-to-many dependency between objects so that when one object
 * (the Subject) changes state, all its dependents (Observers) are notified
 * automatically.
 *
 * In Node.js this is built into the EventEmitter class — we extend it
 * to turn any class into a live event broadcaster.
 *
 * Real-world uses: WebSocket broadcasting, file-watcher daemons,
 * message queues, live dashboard feeds.
 */

const EventEmitter = require('events')

// ─── Subject (Publisher) ───────────────────────────────────────────────────

class StockMarket extends EventEmitter {
  constructor() {
    super()
    this.prices = {}
  }

  updatePrice(symbol, newPrice) {
    const previous = this.prices[symbol] ?? newPrice
    const change = (((newPrice - previous) / previous) * 100).toFixed(2)
    const direction = newPrice >= previous ? '▲' : '▼'

    this.prices[symbol] = newPrice

    // Notify all observers subscribed to 'priceChange'
    this.emit('priceChange', { symbol, newPrice, previous, change, direction })

    // Conditional alert event
    if (Math.abs(change) > 5) {
      this.emit('bigMove', { symbol, change, direction })
    }
  }

  getSnapshot() {
    return this.prices
  }
}

// ─── Concrete Observers ────────────────────────────────────────────────────

class Logger {
  attach(market) {
    market.on('priceChange', ({ symbol, newPrice, direction, change }) => {
      console.log(`  [Logger]     ${symbol} ${direction} $${newPrice}  (${change}%)`)
    })
  }
}

class Dashboard {
  constructor() {
    this.updates = 0
  }

  attach(market) {
    market.on('priceChange', ({ symbol, newPrice }) => {
      this.updates++
      console.log(`  [Dashboard]  Rendering chart for ${symbol} → $${newPrice}  (total updates: ${this.updates})`)
    })
  }
}

class AlertService {
  attach(market) {
    market.on('bigMove', ({ symbol, change, direction }) => {
      console.log(`  [Alert] 🚨  BIG MOVE detected! ${symbol} ${direction} ${Math.abs(change)}% — sending SMS...`)
    })
  }
}

module.exports = { StockMarket, Logger, Dashboard, AlertService }
