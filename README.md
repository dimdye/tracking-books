# Ex Libris: putting it on your Home Screen

Ex Libris is a plain web app: these 7 files and nothing else. Your books are
saved only on your phone, inside the app. The only things it ever sends over
the internet are book lookups (to Google Books and Open Library) and font and
cover-image downloads.

Files:
`index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`,
`icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`

It needs to live at an `https://` address for "Add to Home Screen", the camera
scanner and offline use to work. Pick one of the two options below.

## Option A: GitHub Pages (free, works from your phone)

1. In the Files app, tap the zip to unpack it.
2. Go to github.com and sign in (or create a free account).
3. Tap **+** → **New repository**. Name it `ex-libris`, keep it **Public**,
   and create it.
4. On the new repository page, tap **uploading an existing file**. Pick all 7
   files from the unpacked folder (the README is optional) and tap
   **Commit changes**.
5. Go to **Settings** → **Pages**. Under "Build and deployment", set
   **Source: Deploy from a branch**, then **Branch: main**, folder
   **/ (root)**. Tap **Save**.
6. Wait a minute or two. Your app is then at
   `https://<your-username>.github.io/ex-libris/`

Public here only means the app's code is visible. Your books are never
uploaded anywhere.

## Option B: Firebase Hosting (like Books & Boba, needs a computer)

1. At console.firebase.google.com, create a **new project** (for example
   "ex-libris"). You don't need Firestore or Analytics.
2. On your computer, in an empty folder containing these files, run:
   ```
   firebase login
   firebase init hosting
   ```
   Choose the new project. Set the public directory to `.`. Answer **No** to
   "single-page app" and **No** to overwriting `index.html`.
3. Run `firebase deploy --only hosting` and open the Hosting URL it prints.

## Add it to your Home Screen

- **iPhone:** open the link in **Safari** → tap **Share** → **Add to Home
  Screen**. From then on, always open Ex Libris from its icon. On iPhone, the
  Home Screen app keeps its own library, separate from the Safari tab.
- **Android:** open the link in **Chrome** → menu (⋮) → **Install app** or
  **Add to Home screen**.

## Backups

Your library lives on the phone. If you delete the app or reset the phone, the
library is gone too. Now and then, open **⚙ Goals & settings** → **Export**
and save the file to Files, Drive or an email to yourself. **Import** restores
it, including on a new phone.

## Updating the app later

Replace `index.html` with the new version. In `service-worker.js`, change
`ex-libris-v1` to `ex-libris-v2` (and so on), then upload both files. Your
books aren't touched.
