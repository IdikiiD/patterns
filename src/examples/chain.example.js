const { buildPipeline } = require('../patterns/chain')

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  CHAIN OF RESPONSIBILITY — HTTP Request Pipeline')
console.log('  RateLimiter → Auth → Validator → Logger → Router')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const pipeline = buildPipeline()

const requests = [
  {
    label: 'Valid GET request',
    request: { ip: '10.0.0.1', token: 'token-user', method: 'GET', path: '/api/users' },
  },
  {
    label: 'Missing auth token',
    request: { ip: '10.0.0.2', token: null, method: 'GET', path: '/api/users' },
  },
  {
    label: 'Invalid token',
    request: { ip: '10.0.0.3', token: 'bad-token', method: 'GET', path: '/api/products' },
  },
  {
    label: 'Bad HTTP method',
    request: { ip: '10.0.0.4', token: 'token-admin', method: 'PATCH', path: '/api/users' },
  },
  {
    label: 'Unknown route (falls through)',
    request: { ip: '10.0.0.5', token: 'token-user', method: 'GET', path: '/api/unknown' },
  },
  {
    label: 'Rate limit test (6 requests from same IP)',
    request: { ip: '10.0.0.1', token: 'token-admin', method: 'GET', path: '/api/users' },
  },
]

for (const { label, request } of requests) {
  console.log(`  ┌─ ${label}`)
  const response = pipeline.handle(request)
  if (response) {
    console.log(`  └─ Response: ${response.status} — ${JSON.stringify(response.body)}\n`)
  } else {
    console.log('  └─ Response: (unhandled)\n')
  }
}
