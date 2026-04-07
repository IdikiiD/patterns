const { StockMarket, Logger, Dashboard, AlertService } = require('../patterns/observer')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  OBSERVER PATTERN — Stock Market Event Bus')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const market   = new StockMarket()
const logger   = new Logger()
const dash     = new Dashboard()
const alertSvc = new AlertService()

// Attach all observers to the same subject
logger.attach(market)
dash.attach(market)
alertSvc.attach(market)

console.log('  [Setup] 3 observers subscribed to StockMarket\n')

console.log('  → market.updatePrice("AAPL", 150)')
market.updatePrice('AAPL', 150)

console.log('\n  → market.updatePrice("AAPL", 158)')
market.updatePrice('AAPL', 158)

console.log('\n  → market.updatePrice("TSLA", 180)  [big move — alert fires!]')
market.updatePrice('TSLA', 100)
market.updatePrice('TSLA', 180)

console.log('\n  → market.updatePrice("NVDA", 900)')
market.updatePrice('NVDA', 900)

console.log('\n  [Snapshot]', market.getSnapshot())
