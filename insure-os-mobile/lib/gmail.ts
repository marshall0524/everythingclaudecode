import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as SecureStore from 'expo-secure-store'

WebBrowser.maybeCompleteAuthSession()

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? ''
const GMAIL_SEARCH_QUERY =
  'has:attachment (insurance OR policy OR premium OR coverage OR claim OR insurer) newer_than:3y'

export async function signInWithGoogle(
  redirectUri: string
): Promise<string | null> {
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  }

  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
  })

  await request.makeAuthUrlAsync(discovery)
  const result = await request.promptAsync(discovery)

  if (result.type !== 'success') return null

  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: GOOGLE_CLIENT_ID,
      code: result.params.code,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? '' },
    },
    { tokenEndpoint: discovery.tokenEndpoint }
  )

  await SecureStore.setItemAsync('gmail_access_token', tokenResult.accessToken)
  return tokenResult.accessToken
}

export async function searchInsuranceEmails(token: string): Promise<any[]> {
  const url = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(GMAIL_SEARCH_QUERY)}&maxResults=50`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.messages ?? []
}

export async function getEmailDetails(
  token: string,
  messageId: string
): Promise<any | null> {
  const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getAttachment(
  token: string,
  messageId: string,
  attachmentId: string
): Promise<string | null> {
  const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.data ?? null // base64url encoded
}

export function extractEmailSubject(message: any): string {
  const headers = message?.payload?.headers ?? []
  return (
    headers.find((h: any) => h.name === 'Subject')?.value ?? 'No Subject'
  )
}

export function extractEmailFrom(message: any): string {
  const headers = message?.payload?.headers ?? []
  return headers.find((h: any) => h.name === 'From')?.value ?? 'Unknown'
}
