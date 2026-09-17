# StakSuite

Restaurant operations app (StockStak + SweetStak).

## Firebase project
`stak-suite-e537d`

## Setup
1. Open `index.html` in a browser (prefer local server or hosted HTTPS).
2. Firebase Console → Authentication → enable Email/Password.
3. Create Firestore database if needed.
4. Deploy rules: `firebase deploy --only firestore:rules`
5. Create company portal, then open portal.

## Auth model
Firebase Auth UID ↔ `stak_companies/{companyId}.uid`

## Notes
- No Cloud Functions required.
- `STAK_DEMO_MODE` is `false` in this build.
