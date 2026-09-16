// Real Google OAuth2 authentication service
import type { DriveAccount } from '../types'
import { storage, generateId } from './storage'
import { GOOGLE_CONFIG, isOAuthConfigured } from '../config/google'
import { getUserInfo, getDriveStorageInfo } from './googleDrive'

export interface OAuthState {
  codeVerifier: string
  state: string
  timestamp: number
}

// Generate PKCE code verifier
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Generate PKCE code challenge
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Start OAuth flow - redirects to Google
export async function startOAuthFlow(): Promise<void> {
  if (!isOAuthConfigured()) {
    throw new Error('Google OAuth not configured. Please set VITE_GOOGLE_CLIENT_ID in .env file. See SETUP_GUIDE.md for instructions.')
  }

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
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
    response_type: 'code',
    scope: GOOGLE_CONFIG.SCOPES.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
  })

  // Redirect to Google OAuth
  window.location.href = `${GOOGLE_CONFIG.AUTH_URL}?${params.toString()}`
}

// Handle OAuth callback
export async function handleOAuthCallback(): Promise<DriveAccount | null> {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const error = urlParams.get('error')

  // Check for errors
  if (error) {
    throw new Error(`OAuth error: ${error} - ${urlParams.get('error_description')}`)
  }

  if (!code || !state) {
    return null
  }

  // Verify state
  const storedState = sessionStorage.getItem('gridly_oauth_state')
  if (!storedState) {
    throw new Error('OAuth state not found. Please try again.')
  }

  const oauthState: OAuthState = JSON.parse(storedState)
  
  if (oauthState.state !== state) {
    throw new Error('OAuth state mismatch. Possible CSRF attack.')
  }

  // Check if state is too old (5 minutes)
  if (Date.now() - oauthState.timestamp > 5 * 60 * 1000) {
    throw new Error('OAuth state expired. Please try again.')
  }

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code, oauthState.codeVerifier)

  // Get user info
  const userInfo = await getUserInfo(tokens.accessToken)

  // Get storage info
  const storageInfo = await getDriveStorageInfo(tokens.accessToken)

  // Create account
  const account: DriveAccount = {
    id: generateId(),
    name: userInfo.name + "'s Drive",
    email: userInfo.email,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenExpiry: Date.now() + tokens.expiresIn * 1000,
    avatar: userInfo.picture,
    usedBytes: storageInfo.usedBytes,
    totalBytes: storageInfo.totalBytes,
    fileCount: 0, // Will be updated on first browse
    folderCount: 0,
    rcloneRemote: `gdrive_${userInfo.email.split('@')[0].replace(/[^a-z0-9]/g, '')}`,
    status: 'connected',
    addedAt: Date.now(),
    lastSynced: Date.now(),
  }

  // Save account
  storage.addAccount(account)

  // Clean up
  sessionStorage.removeItem('gridly_oauth_state')
  
  // Clean URL
  window.history.replaceState({}, document.title, window.location.pathname)

  return account
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
}> {
  const response = await fetch(GOOGLE_CONFIG.TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  }
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const response = await fetch(GOOGLE_CONFIG.TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Token refresh failed: ${error.error_description || error.error}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  }
}

// Check if token needs refresh
export function isTokenExpired(account: DriveAccount): boolean {
  return Date.now() >= account.tokenExpiry - 5 * 60 * 1000 // 5 min buffer
}

// Ensure valid token
export async function ensureValidToken(account: DriveAccount): Promise<DriveAccount> {
  if (!isTokenExpired(account)) return account

  try {
    const result = await refreshAccessToken(account.refreshToken)
    const updated = {
      ...account,
      accessToken: result.accessToken,
      tokenExpiry: Date.now() + result.expiresIn * 1000,
    }
    storage.updateAccount(account.id, updated)
    return updated
  } catch (error) {
    // If refresh fails, mark account as disconnected
    storage.updateAccount(account.id, { status: 'disconnected' })
    throw new Error('Failed to refresh token. Please reconnect your account.')
  }
}

// Disconnect account
export function disconnectAccount(accountId: string): void {
  storage.removeAccount(accountId)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Check if OAuth is configured
export { isOAuthConfigured }
