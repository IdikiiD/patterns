/**
 * CHAIN OF RESPONSIBILITY PATTERN
 *
 * Passes a request along a chain of handlers. Each handler decides either
 * to process the request or pass it to the next handler in the chain.
 *
 * Key idea: decouples the sender from the receiver. The sender just fires
 * the request into the chain — it doesn't know who (if anyone) will handle it.
 *
 * Real-world uses: Express.js middleware (app.use), authentication pipelines,
 * input validation layers, logging interceptors, support ticket escalation.
 */

// ─── Abstract Handler ──────────────────────────────────────────────────────

class Handler {
  constructor(name) {
    this.name = name
    this.next = null
  }

  // Link the next handler and return it so you can chain: a.setNext(b).setNext(c)
  setNext(handler) {
    this.next = handler
    return handler
  }

  // Default: forward to next. Subclasses call super.handle() to pass through.
  handle(request) {
    if (this.next) {
      return this.next.handle(request)
    }
    console.log(`  [Chain]      ✘ Request "${request.path}" was not handled by any handler.`)
    return null
  }
}

// ─── Concrete Handlers ─────────────────────────────────────────────────────

class RateLimiterHandler extends Handler {
  constructor() {
    super('RateLimiter')
    this.requestCounts = {}
    this.limit = 5
  }

  handle(request) {
    const ip = request.ip || '127.0.0.1'
    this.requestCounts[ip] = (this.requestCounts[ip] ?? 0) + 1

    if (this.requestCounts[ip] > this.limit) {
      console.log(`  [${this.name}]  ✘ BLOCKED ${ip} — too many requests (${this.requestCounts[ip]}/${this.limit})`)
      return { status: 429, body: 'Too Many Requests' }
    }

    console.log(`  [${this.name}]  ✔ Passed  (${this.requestCounts[ip]}/${this.limit} requests from ${ip})`)
    return super.handle(request)
  }
}

class AuthHandler extends Handler {
  constructor() {
    super('Auth      ')
    this.validTokens = new Set(['token-admin', 'token-user', 'token-readonly'])
  }

  handle(request) {
    if (!request.token) {
      console.log(`  [${this.name}]  ✘ REJECTED — no auth token provided`)
      return { status: 401, body: 'Unauthorized' }
    }

    if (!this.validTokens.has(request.token)) {
      console.log(`  [${this.name}]  ✘ REJECTED — invalid token: "${request.token}"`)
      return { status: 403, body: 'Forbidden' }
    }

    console.log(`  [${this.name}]  ✔ Passed  (token: "${request.token}")`)
    return super.handle(request)
  }
}

class ValidationHandler extends Handler {
  constructor() {
    super('Validator ')
  }

  handle(request) {
    const errors = []

    if (!request.path || !request.path.startsWith('/')) {
      errors.push('path must start with /')
    }
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      errors.push(`unknown method: ${request.method}`)
    }
    if (request.body && typeof request.body !== 'object') {
      errors.push('body must be an object')
    }

    if (errors.length) {
      console.log(`  [${this.name}]  ✘ INVALID — ${errors.join(', ')}`)
      return { status: 400, body: `Bad Request: ${errors.join(', ')}` }
    }

    console.log(`  [${this.name}]  ✔ Passed  (${request.method} ${request.path})`)
    return super.handle(request)
  }
}

class LoggerHandler extends Handler {
  constructor() {
    super('Logger    ')
    this.log = []
  }

  handle(request) {
    const entry = {
      time:   new Date().toISOString(),
      method: request.method,
      path:   request.path,
      ip:     request.ip,
    }
    this.log.push(entry)
    console.log(`  [${this.name}]  ✔ Logged  [${entry.time}] ${entry.method} ${entry.path}`)
    return super.handle(request)
  }
}

class RouterHandler extends Handler {
  constructor() {
    super('Router    ')
    this.routes = {
      'GET /api/users':    () => ({ status: 200, body: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }),
      'GET /api/products': () => ({ status: 200, body: [{ id: 1, name: 'Widget' }] }),
      'POST /api/users':   () => ({ status: 201, body: { message: 'User created' } }),
    }
  }

  handle(request) {
    const key    = `${request.method} ${request.path}`
    const route  = this.routes[key]

    if (route) {
      const response = route()
      console.log(`  [${this.name}]  ✔ Handled ${key} → ${response.status}`)
      return response
    }

    console.log(`  [${this.name}]  ✘ No route for ${key}, passing down...`)
    return super.handle(request)
  }
}

// ─── Pipeline Builder ──────────────────────────────────────────────────────

function buildPipeline() {
  const rateLimiter = new RateLimiterHandler()
  const auth        = new AuthHandler()
  const validator   = new ValidationHandler()
  const logger      = new LoggerHandler()
  const router      = new RouterHandler()

  // Chain them: rateLimiter → auth → validator → logger → router
  rateLimiter
    .setNext(auth)
    .setNext(validator)
    .setNext(logger)
    .setNext(router)

  return rateLimiter  // return head of the chain
}

module.exports = {
  Handler,
  RateLimiterHandler,
  AuthHandler,
  ValidationHandler,
  LoggerHandler,
  RouterHandler,
  buildPipeline,
}
