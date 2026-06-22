# TirthDarshi (CleanDD)

Android React Native app for discovering temples, navigation, and bilingual content.

## Requirements

- Node.js 18+
- JDK 17
- Android Studio with SDK 35
- A physical device or emulator with Google Play services (for Maps / Navigation)

## Setup

```bash
cd apps/CleanDD
npm install
```

Copy environment templates (optional for local docs):

```bash
copy .env.example .env
copy android\keystore.properties.example android\keystore.properties
copy android\gradle.properties.example android\gradle.properties   # if you maintain a local template
```

Fill in `android/keystore.properties` with your release keystore path and passwords (never commit this file).

## Run (debug)

```bash
npm start
npm run android
```

## Release build (Play Store)

```bash
cd android
gradlew.bat bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Test the signed build on a real device before uploading to Google Play Console.

## CI / automated release (GitHub Actions)

Full setup guide: **[docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md)**

| Workflow | When | Output |
|----------|------|--------|
| **TirthDarshi CI** | Every push to `apps/CleanDD` | Tests + lint |
| **TirthDarshi Release** | Manual (Actions → Run workflow) | Signed `.aab` + `.apk` |

### One-time setup (you, in GitHub)

Repo → **Settings** → **Secrets and variables** → **Actions** → add 5 secrets (see setup guide).

## Google Cloud — restrict all API keys (manual)

In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**, restrict **each** key:

| Key used for | Restrict to |
|--------------|-------------|
| Maps (`MAPS_API_KEY`) | Android app `com.thirtdarshi.app` + debug & release SHA-1 |
| Directions (`GOOGLE_API_KEY` in `packages/google/googleApi.js`) | Same package + SHA-1, APIs: Directions + Maps as needed |
| Firebase (`google-services.json` / `firebase.config.js`) | Android app + SHA-1 in Firebase; key restrictions in GCP |

Release SHA-1: `92:98:FF:88:38:4F:7E:0C:77:25:8E:55:0D:DF:D9:73:BB:24:F8:73`  
Debug SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

## Admin

Temple data management uses the **web admin** at `apps/web` — not the mobile app.  
Mobile app blocks `admin@temple.com` from login/signup.

## Project structure

| Path | Purpose |
|------|---------|
| `App.js` | Navigation root |
| `screens/` | App screens |
| `config/adminConfig.js` | Reserved admin email |
| `android/keystore.properties` | Release signing (local only) |
| `firestore.rules` (repo root) | Firestore security rules |
