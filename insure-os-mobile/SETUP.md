# InsureOS Mobile — Setup

## Run
```bash
npx expo start
```

## Environment
Copy `.env.example` to `.env.local` and fill in:
- `EXPO_PUBLIC_ANTHROPIC_API_KEY` — from console.anthropic.com
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID` — from Google Cloud Console

## Google OAuth Setup
1. Google Cloud Console → New Project → Enable Gmail API
2. Create OAuth credentials: iOS client + Android client + Web client
3. Add `insure-os://` as authorized redirect URI in each
4. Copy the client ID to `.env.local`

## Device Testing
```bash
# Install Expo Go on phone, then:
npx expo start
# Scan QR code in terminal
```

## Build
```bash
npx expo export --platform web   # web build
npx eas build --platform ios     # native iOS (requires EAS)
```
