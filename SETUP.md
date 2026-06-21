# vetsays — blog & editing setup

This site is built with [Eleventy (11ty)](https://www.11ty.dev/) and hosted on
**GitHub Pages** at `vetsays.github.io`. Blog posts are Markdown files in `src/blog/`,
and the author edits them from a browser at **`/admin`** — no git, no `push`, no
Markdown by hand.

- **Homepage** — the "Featured pet care reads" grid is generated from the blog posts.
- **Blog index** (`/blog/`) — lists every article.
- **Each post** gets its own page at `/blog/<post-name>/` with social-share tags.
- **Editor** — Sveltia CMS at `/admin`, signing in with the **existing `vetsays`
  GitHub account** the author already has.

How publishing works: the author writes in the `/admin` UI → the CMS commits the post
to this repo → a **GitHub Action** rebuilds the site → GitHub Pages serves it. The
author never sees any of that.

---

## 1. Run it locally (optional, for whoever maintains the code)

```bash
npm install      # one time
npm run dev      # live preview at http://localhost:8080
npm run build    # production build into _site/
```

Posts are Markdown in `src/blog/`. Images live in `src/assets/`.

---

## 2. One-time go-live setup

Do these once. All free.

### a. Switch GitHub Pages to build with Actions
GitHub Pages doesn't run Eleventy on its own, so we let a GitHub Action build it.

1. Repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

That's it — the workflow in `.github/workflows/deploy.yml` builds and publishes the
site on every push to `main`. (This also fixes the current blank page: Pages was
serving raw source instead of the built site.)

### b. Create a GitHub OAuth App (so the editor login works)
A static site can't complete a GitHub login by itself, so we register an OAuth App and
a tiny helper. First the OAuth App:

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   (<https://github.com/settings/developers>). Sign in as the **vetsays** account.
2. Fill in:
   - **Application name:** `vetsays editor`
   - **Homepage URL:** `https://vetsays.github.io`
   - **Authorization callback URL:** `https://YOUR-WORKER.workers.dev/callback`
     (you'll get this exact URL in the next step — come back and paste it).
3. **Register application.** Copy the **Client ID**, then **Generate a new client
   secret** and copy that too. Keep both handy for step c.

### c. Deploy the login helper (Sveltia auth worker, on Cloudflare — free)
This is the one small piece of infrastructure. It holds the OAuth secret (which must
never live in the public repo) and completes the GitHub login.

1. Sign up at <https://dash.cloudflare.com> (free).
2. Deploy **`sveltia/sveltia-cms-auth`** — the project's README has a one-click
   *Deploy to Cloudflare* button: <https://github.com/sveltia/sveltia-cms-auth>.
3. In the Worker's **Settings → Variables**, add:
   - `GITHUB_CLIENT_ID` = the Client ID from step b
   - `GITHUB_CLIENT_SECRET` = the Client Secret from step b
   - `ALLOWED_DOMAINS` = `vetsays.github.io`
4. Copy the Worker's URL (looks like `https://sveltia-cms-auth.<you>.workers.dev`).
5. Go back to the OAuth App (step b) and set the **callback URL** to
   `https://sveltia-cms-auth.<you>.workers.dev/callback`. Save.

> Prefer not to use Cloudflare? The same worker also runs on **Deno Deploy** (free) —
> see the sveltia-cms-auth README. Either works.

### d. Point the site at your login helper
Edit **`src/admin/config.yml`** and replace the `base_url` line with your Worker URL:

```yaml
    base_url: https://sveltia-cms-auth.<you>.workers.dev
```

Commit and push (or I can do this once you tell me the URL). The Action rebuilds.

### e. Done — the author logs in
The author goes to **`https://vetsays.github.io/admin`**, clicks **Sign in with
GitHub**, authorizes once with the **vetsays** account, and starts writing.

---

## 3. How the author adds or edits a blog (share this with Dr. Rashmi)

1. Go to **`vetsays.github.io/admin`** → **Sign in with GitHub** (use the vetsays login).
2. Click **Blog Posts → New Blog Post.**
3. Fill in:
   - **Title** — the headline.
   - **Publish date** — newest posts appear first.
   - **Category** — pick from the list.
   - **Cover image** — drag in a photo (shown on the card and atop the article).
   - **Short summary** — one or two lines for the homepage card.
   - **Author / Read time** — pre-filled; change if you like.
   - **Body** — write the article; the toolbar has headings, **bold**, lists, and
     image upload.
4. Click **Publish.** About a minute later it's live — a new homepage card and its own
   page.
5. To change or remove a post, open it from the same screen, edit, and **Publish**
   again (or delete it).

No code, no git — just the editor.

---

## Notes

- The `npm audit` warnings are in Eleventy's **build-time** tooling only; nothing
  ships to visitors.
- Sveltia CMS can be swapped for the older Decap CMS by changing one `<script>` line in
  `src/admin/index.html`; `config.yml` works with both.
- Zero-infrastructure alternative to the worker: Sveltia also supports signing in with a
  GitHub **personal access token** instead of OAuth — but that's more fiddly for a
  non-technical author and the token expires, so the worker is the better path.
- Want category filtering, a contact form, or a newsletter signup? All doable on this
  setup — just ask.
