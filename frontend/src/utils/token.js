export function generateSimulatedJwt(user) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + 7 * 24 * 60 * 60

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: issuedAt,
    exp: expiresAt,
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const simulatedSignature = btoa(`${encodedHeader}.${encodedPayload}.joineazy_secret`)

  return `${encodedHeader}.${encodedPayload}.${simulatedSignature}`
}

export function parseSimulatedJwt(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const payloadJson = atob(parts[1])
    const payload = JSON.parse(payloadJson)
    const currentTime = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < currentTime) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

