const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'alfinit091224@gmail.com'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'change-me-session-secret'
const SESSION_COOKIE = 'omtauth'

const adminList =
  process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS?.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean) ??
  []

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false
  if (!adminList.length) return true // fallback: allow if list not configured
  return adminList.includes(email.toLowerCase())
}

export const validateSession = (token?: string | null) => {
  if (!token) return null
  if (token !== SESSION_SECRET) return null
  return { sub: ADMIN_EMAIL }
}

export const ADMIN_CONFIG = {
  email: ADMIN_EMAIL,
  cookieName: SESSION_COOKIE,
  sessionSecret: SESSION_SECRET,
}
