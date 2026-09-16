// Authentication service - Simulates Google OAuth2 flow
import type { DriveAccount } from '../types'
import { storage, generateId } from './storage'

// Simulated Google OAuth2 endpoints
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

// In production, these would be real values
const CLIENT_ID = 'gridly-app-client-id'
const REDIRECT_URI = window.location.origin + '/auth/callback'
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'openid',
  'email',
  'profile',
]

export interface OAuthState {
  codeVerifier: string
  state: string
  timestamp: number
}

// Generate PKCE code verifier and challenge
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Start OAuth flow
export async function startOAuthFlow(): Promise<{ authUrl: string; state: OAuthState }> {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateId()

  const oauthState: OAuthState = {
    codeVerifier,
    state,
    timestamp: Date.now(),
  }

  // Store state for verification
  sessionStorage.setItem('gridly_oauth_state', JSON.stringify(oauthState))

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  })

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`

  return { authUrl, state: oauthState }
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  // In production, this would be a real API call
  // For demo, we simulate the token exchange
  await simulateNetworkDelay(800)

  return {
    accessToken: `ya29.${generateId()}_${generateId()}`,
    refreshToken: `1//${generateId()}_${generateId()}`,
    expiresIn: 3600,
  }
}

// Get user info from Google
export async function getUserInfo(accessToken: string): Promise<{
  email: string
  name: string
  picture: string
  sub: string
}> {
  // Simulate API call
  await simulateNetworkDelay(500)

  // In production: fetch(GOOGLE_USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
  const names = ['Alex Chen', 'Sarah Miller', 'James Wilson', 'Emma Davis', 'Michael Brown']
  const name = names[Math.floor(Math.random() * names.length)]
  const email = name.toLowerCase().replace(' ', '.') + '@gmail.com'

  return {
    email,
    name,
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`,
    sub: generateId(),
  }
}

// Get drive storage info
export async function getDriveStorageInfo(accessToken: string): Promise<{
  usedBytes: number
  totalBytes: number
}> {
  await simulateNetworkDelay(400)

  // Simulate different storage amounts
  const totalBytes = [15 * 1024 * 1024 * 1024, 100 * 1024 * 1024 * 1024, 2 * 1024 * 1024 * 1024 * 1024][
    Math.floor(Math.random() * 3)
  ]
  const usedBytes = Math.floor(totalBytes * (0.1 + Math.random() * 0.8))

  return { usedBytes, totalBytes }
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  expiresIn: number
}> {
  await simulateNetworkDelay(300)

  return {
    accessToken: `ya29.refreshed.${generateId()}`,
    expiresIn: 3600,
  }
}

// Connect a new Google Drive account (simulated full flow)
export async function connectGoogleAccount(
  email?: string,
  name?: string
): Promise<DriveAccount> {
  // Simulate OAuth flow
  await simulateNetworkDelay(1500)

  const userInfo = email
    ? {
        email,
        name: name || email.split('@')[0],
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=6366f1&color=fff&size=128`,
        sub: generateId(),
      }
    : await getUserInfo('mock-token')

  const storageInfo = await getDriveStorageInfo('mock-token')

  const account: DriveAccount = {
    id: generateId(),
    name: userInfo.name + "'s Drive",
    email: userInfo.email,
    accessToken: `ya29.${generateId()}`,
    refreshToken: `1//${generateId()}`,
    tokenExpiry: Date.now() + 3600 * 1000,
    avatar: userInfo.picture,
    usedBytes: storageInfo.usedBytes,
    totalBytes: storageInfo.totalBytes,
    fileCount: Math.floor(Math.random() * 50000) + 100,
    folderCount: Math.floor(Math.random() * 5000) + 50,
    rcloneRemote: `gdrive_${userInfo.email.split('@')[0].replace(/[^a-z0-9]/g, '')}`,
    status: 'connected',
    addedAt: Date.now(),
    lastSynced: null,
  }

  storage.addAccount(account)
  return account
}

// Disconnect account
export function disconnectAccount(accountId: string): void {
  storage.removeAccount(accountId)
}

// Check if token needs refresh
export function isTokenExpired(account: DriveAccount): boolean {
  return Date.now() >= account.tokenExpiry - 300000 // 5 min buffer
}

// Refresh token if needed
export async function ensureValidToken(account: DriveAccount): Promise<DriveAccount> {
  if (!isTokenExpired(account)) return account

  const result = await refreshAccessToken(account.refreshToken)
  const updated = {
    ...account,
    accessToken: result.accessToken,
    tokenExpiry: Date.now() + result.expiresIn * 1000,
  }
  storage.updateAccount(account.id, updated)
  return updated
}

function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
