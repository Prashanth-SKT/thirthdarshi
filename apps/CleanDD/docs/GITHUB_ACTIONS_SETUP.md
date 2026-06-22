# GitHub Actions setup — TirthDarshi Android

Use this once to enable automated test/lint and cloud release builds.

## What runs automatically

| Workflow | When | Output |
|----------|------|--------|
| **TirthDarshi CI** | Every push to `apps/CleanDD` | Tests + lint |
| **TirthDarshi Release** | You click Run workflow | Signed `.aab` + `.apk` |

## Step 1 — Push code to GitHub

From project root (`thirthdarshi-main`):

```powershell
cd E:\thirthdarshi-main\thirthdarshi-main
git add .
git status
```

**Before commit, confirm these are NOT listed** (they must stay local):

- `android/keystore.properties`
- `android/gradle.properties` (contains Maps key)
- `*.keystore` (except debug is ok to ignore)
- `android/local.properties`

```powershell
git commit -m "Add TirthDarshi app and GitHub Actions workflows"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

Replace with your real GitHub repo URL.

## Step 2 — Add GitHub secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret name | Value |
|-------------|--------|
| `ANDROID_KEYSTORE_BASE64` | Base64 of `thirtdarshi-new.keystore` (see below) |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password |
| `ANDROID_KEY_ALIAS` | `thirtdarshi` |
| `ANDROID_KEY_PASSWORD` | Same as store password (PKCS12) |
| `MAPS_API_KEY` | Your restricted Google Maps API key |

### Encode keystore (Windows)

```powershell
[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("E:\thirthdarshi-main\thirthdarshi-main\apps\CleanDD\android\app\thirtdarshi-new.keystore")
) | Set-Clipboard
```

Paste clipboard into secret `ANDROID_KEYSTORE_BASE64`.

## Step 3 — Run release build

1. GitHub → **Actions** → **TirthDarshi Release**
2. **Run workflow** → Run
3. Wait ~10–15 minutes
4. Open the completed run → **Artifacts**
5. Download:
   - `app-release-aab` → upload to Play Console
   - `app-release-apk` → share with team for testing

## Step 4 — Verify CI

Push any small change under `apps/CleanDD` — **TirthDarshi CI** should pass (green check).

## Troubleshooting

| Error | Fix |
|-------|-----|
| Missing secret | Add all 5 secrets in Step 2 |
| Keystore password incorrect | Re-check `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS` |
| Map blank in CI build | Check `MAPS_API_KEY` secret value |
| Workflow not visible | Push `.github/workflows/` files to `main` branch |

## Still build locally?

Yes. GitHub is optional. Local commands still work:

```powershell
cd apps\CleanDD\android
.\gradlew.bat bundleRelease    # Play Store .aab
.\gradlew.bat assembleRelease  # Team .apk
```
