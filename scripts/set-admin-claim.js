/**
 * ONE-TIME SCRIPT: Give admin access to a user in Firebase
 *
 * BEFORE RUNNING:
 * 1. Firebase Console → Project settings → Service accounts
 * 2. Click "Generate new private key" → save as serviceAccountKey.json
 * 3. Put serviceAccountKey.json in this scripts/ folder (NEVER upload to GitHub)
 * 4. Run: cd scripts && npm install firebase-admin && node set-admin-claim.js your-email@example.com
 *
 * AFTER RUNNING:
 * - That user must LOG OUT and LOG IN again in the app
 * - Remove admin@temple.com email check from app if you still use it (optional)
 */

const admin = require('firebase-admin');
const path = require('path');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node set-admin-claim.js admin-email@yourcompany.com');
  process.exit(1);
}

const keyPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(keyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error(
    'Missing serviceAccountKey.json in scripts/ folder.\n' +
      'Download it from Firebase Console → Project settings → Service accounts.'
  );
  process.exit(1);
}

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log('Success! Admin access granted to:', email);
  console.log('Ask this person to log out and log in again in the app.');
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
