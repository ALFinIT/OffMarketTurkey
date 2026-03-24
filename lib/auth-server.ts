import crypto from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'alfinit091224@gmail.com'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? ''
const PASSWORD_PEPPER = process.env.ADMIN_PASSWORD_PEPPER ?? 'omt-pepper'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'change-me-session-secret'
const SESSION_COOKIE = 'omtauth'

const timingSafeEqual = (a: string, b: string) => {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export const hashPassword = (password: string) =>
  crypto.createHash('sha256').update(password + PASSWORD_PEPPER).digest('hex')

export const verifyPassword = (password: string) => {
  if (!ADMIN_PASSWORD_HASH) return false
  const hashed = hashPassword(password)
  return timingSafeEqual(hashed, ADMIN_PASSWORD_HASH)
}

export const createSessionToken = () => SESSION_SECRET

export const ADMIN_SERVER_CONFIG = {
  email: ADMIN_EMAIL,
  cookieName: SESSION_COOKIE,
  sessionSecret: SESSION_SECRET,
}
