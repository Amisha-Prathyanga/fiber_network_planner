# Fibre Network Planner

A single-page demo built on the ArcGIS Maps SDK for JavaScript: fibre path
routing, saving paths, and finding the nearest FDP to a customer location.
It is deployed on Vercel from the `main` branch.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole application (markup, styles and script). |
| `api/config.js` | Vercel serverless function. Serves the ArcGIS API key to the page and implements the on-hold switch. |
| `on-hold.html` | The "application is on hold" page shown to visitors while the switch is on. |
| `dev-server.js` | Small Node server for running the app locally without the Vercel CLI. |
| `.env.local` | Local environment variables. Gitignored – never commit it. |

## How the API key works

The ArcGIS API key is **not** in the code. `index.html` loads
`<script src="/api/config"></script>`, and `api/config.js` answers with
`var esriConfig = { apiKey: "..." }`, reading the key from the
`ARCGIS_API_KEY` environment variable.

Because of this, opening `index.html` directly from disk or through a plain
static server (e.g. Live Server) does not work – `/api/config` needs a server.

## Environment variables

| Variable | Where | Meaning |
| --- | --- | --- |
| `ARCGIS_API_KEY` | Vercel and `.env.local` | The ArcGIS API key sent to the page. |
| `APP_ON_HOLD` | Vercel (and `.env.local` for testing) | `true` puts the application on hold. Unset or `false` means the app runs normally. |

On Vercel these live under Project → Settings → Environment Variables.
**A change only takes effect after a redeploy** (Deployments → latest → Redeploy).

## Running locally

Requires Node.js 20.12 or newer. There are no dependencies to install.

1. Create `.env.local` in the project root:
   ```
   ARCGIS_API_KEY=your-key-here
   ```
2. Start the server:
   ```
   node dev-server.js
   ```
3. Open http://localhost:3000 (set the `PORT` variable to use another port).

## Putting the application on hold

Every visit to the app spends ArcGIS credits, so the app can be paused.

**To put it on hold**

1. In Vercel, set `APP_ON_HOLD` = `true` for Production.
2. Redeploy the latest deployment.
3. Open the live site and confirm the on-hold page appears.

While on hold, `api/config.js` withholds the API key and redirects every
visitor to `on-hold.html`.

**To turn it back on**

1. Set `APP_ON_HOLD` to `false` (or delete it).
2. Redeploy.

To preview the hold page locally, add `APP_ON_HOLD=true` to `.env.local` and
run `node dev-server.js`.

To change the wording or add admin contact details, edit `on-hold.html`.

## Important: the hold switch does not disable a key

The API key is delivered to the browser, so anyone who has already seen a key
can keep calling ArcGIS directly, outside this app. The hold switch only
blocks access through the live site. To fully stop credit use:

- **Delete or regenerate the keys in the ArcGIS account.** Earlier versions of
  `index.html` had keys hardcoded, and those keys are still readable in this
  repository's git history. Treat them as exposed.
- **Delete old deployments in Vercel.** Each past deployment keeps its own URL
  and still serves the page as it was at that time.

When re-enabling the app, create a new key, put it in `ARCGIS_API_KEY`, and
restrict it to the site's domain (referrer setting on the key in ArcGIS).

## Deploying

Pushing to `main` triggers a Vercel deployment. There is no build step.
