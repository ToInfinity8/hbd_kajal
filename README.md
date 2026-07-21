# Happy Birthday, Kajal! 🎂

A single-page interactive birthday website. Open `index.html` in a browser to preview it right now — no build step needed.

## What's inside

| File | Purpose |
|---|---|
| `index.html` | Page structure / all scenes (loading → landing → welcome → memories → reasons → cake → final) |
| `style.css` | All styling and animations |
| `script.js` | All behavior — **and all personalization** (see below) |
| `images/` | Drop your real photos here |
| `media/` | Drop an optional background music file here |

## 1. Personalize the content

Open `script.js` and edit the `CONFIG` object at the very top. Everything is in one place:

- `recipientName` — shown on the landing screen and welcome message
- `knownDuration` — `{ years, months, days, mins }`, each of which counts up on the welcome screen (seconds are shown as plain text, not an exact number)
- `welcomeMessage` — the typewriter text
- `memories` — one caption per photo (add/remove array entries for more/fewer memories)
- `reasons` — the flip-card grid (emoji + text)
- `signOff` — final message sign-off (currently `"— From Me"`)

## 2. Add your photos

Drop image files into `images/` named:

```
images/memory1.jpg   (or .jpeg / .png / .webp — any of these work)
images/memory2.jpg
images/memory3.jpg
images/memory4.jpg
```

The page automatically tries `.jpg`, `.jpeg`, `.png`, then `.webp` for each numbered memory, so any common format works as long as the number matches.

(If you change the number of entries in `CONFIG.memories`, add/remove matching numbered files.) Until you add real photos, a placeholder graphic shows automatically — nothing will look broken.

**iPhone photos (.HEIC) will not display** — no browser can render `.HEIC` in a webpage. Convert first:
- **Mac**: open in Preview → File → Export → JPEG (or select the photos in Finder → right-click → "Convert to JPEG" if you have that extension, or `sips -s format jpeg IMG_3187.HEIC --out images/memory1.jpg` in Terminal)
- **iPhone**: Settings → Camera → Formats → "Most Compatible" makes new photos save as JPEG automatically (existing photos need converting individually)
- **Any OS**: many free online HEIC→JPG converters work in a pinch

**Getting photos onto this server**: if you're editing/previewing this project on a different machine than where the files live, copy the finished, renamed images up with `scp`:

```
scp memory1.jpg memory2.jpg memory3.jpg memory4.jpg \
  <your-username>@<server-host>:/proj/daindia/shailendra/hbd/images/
```

Or just do this step once you're ready to push everything to GitHub — the photos only need to exist wherever you actually deploy from.

## 3. Optional: background music

Background music: `media/bg-music.mp3` — **optional.** By default the site plays a soft, synthesized instrumental of "Happy Birthday to You" (generated in-browser, no file needed — the melody itself is public domain). Drop a real mp3 here if you'd rather use an actual song; it overrides the built-in melody automatically.

## 4. Try it locally

Because the page checks whether media files exist (via `fetch`), opening `index.html` directly by double-clicking may block those checks in some browsers. Easiest fix — run a tiny local server from this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## 5. Push to GitHub

A `.gitignore` is already included (excludes `.DS_Store`, AppleDouble `._*` junk, and local `.claude/` tool settings).

```
git init
git add .
git commit -m "Birthday website for Kajal"
git branch -M main
```

Create an empty repo on [github.com/new](https://github.com/new) (don't initialize it with a README), then:

```
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

From here, pick **one** of the two options below to actually host it.

### Option A: GitHub Pages

On GitHub: **Settings → Pages → Deploy from branch → main → / (root)**. After a minute you'll get a URL like:

```
https://<your-username>.github.io/<repo-name>/
```

### Option B: Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Connect GitHub and pick this repo.
3. Build settings: leave **Build command** empty and **Publish directory** as `.` (or `/`) — it's a static site, nothing to build.
4. Click **Deploy site**. You'll get a URL like `https://<random-name>.netlify.app` (can rename it under Site settings → Domain management).

### Option C: Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the same GitHub repo.
2. Framework preset: choose **Other** (no build config needed).
3. Click **Deploy**. You'll get a `https://<repo-name>.vercel.app` URL.

Any of these three give you a link you can send via WhatsApp, Instagram, email, or SMS. Netlify/Vercel also auto-redeploy on every `git push`, so future edits (new photos, tweaked text) go live automatically once pushed.

## Notes

- The candle-blowing scene tries to use the microphone (blow to extinguish); if the browser denies mic access or it's unsupported, the "🌬️ Blow out the candles" button and tapping individual candles both work as a fallback.
- Mic access requires HTTPS (or localhost) — this works automatically once deployed to GitHub Pages/Vercel.
- Sound effects (chime, click, whoosh, fireworks boom) are synthesized in-browser — no audio files needed, and they work even without adding background music. Toggle everything with the speaker button, top-right.
