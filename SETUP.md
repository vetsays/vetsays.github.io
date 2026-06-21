# vetsays — blog & editing setup

This site is a static site built with [Eleventy (11ty)](https://www.11ty.dev/). Blog
posts live as Markdown files in `src/blog/`, and the author edits them from a browser
at **`/admin`** — no GitHub account, no code, no command line.

- **Homepage** (`src/index.njk`) — the "Featured pet care reads" grid is generated
  automatically from the blog posts (newest first).
- **Blog index** (`/blog/`) — lists every article.
- **Each post** gets its own page at `/blog/<post-name>/`, with proper title and
  social-share tags.
- **Editor** — Sveltia CMS at `/admin`, logging in with email + password.

---

## 1. Run it locally (optional, for whoever maintains the code)

```bash
npm install      # one time
npm run dev      # live preview at http://localhost:8080
npm run build    # production build into _site/
```

Posts are just Markdown files in `src/blog/`. Images go in `src/assets/`.

---

## 2. One-time go-live setup (do this once)

The editor login and auto-publishing run on **Netlify** (free). You keep this exact
Git repo and your domain — only the hosting moves from GitHub Pages to Netlify.

> ⚠️ Nothing has been pushed yet, so your current live site is untouched. Do these
> steps, then point your domain at Netlify when you're ready to switch.

### a. Push this code to GitHub
Commit and push the repo to `vetsays/vetsays.github.io` (or any GitHub repo).

### b. Connect the repo to Netlify
1. Sign up at <https://app.netlify.com> (use the "Log in with GitHub" option).
2. **Add new site → Import an existing project → GitHub →** pick this repo.
3. Netlify reads `netlify.toml` automatically — build command `npm run build`,
   publish directory `_site`. Click **Deploy**. Your site is live on a
   `*.netlify.app` URL within a minute.

### c. Turn on the editor login (Netlify Identity + Git Gateway)
1. In the site dashboard: **Integrations / Identity → Enable Identity.**
   (On newer dashboards this may be labeled **"Netlify Identity"** under
   *Site configuration → Identity*.)
2. Under **Identity → Registration**, set it to **Invite only** (so only people you
   invite can log in).
3. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway.**
   This is what lets the editor save posts back into the repo.

### d. Invite the author
1. **Identity → Invite users →** enter Dr. Rashmi's email.
2. She gets an email, clicks the link, sets a password, and lands on the site.
3. From then on she goes to **`yourdomain.com/admin`**, logs in, and writes.

### e. Point your domain (when ready to switch off GitHub Pages)
1. Netlify: **Domain management → Add a custom domain →** enter your domain.
2. Update DNS as Netlify instructs (or use Netlify DNS).
3. Netlify provisions HTTPS automatically.
4. Optional: turn off GitHub Pages for the repo so there's only one live site.

### f. One small edit after the domain is final
Open `src/_data/site.json` and change `"url"` to your real domain (e.g.
`https://vetsays.com`). This only affects social-share preview links. Commit it —
or have me do it once the domain is decided.

---

## 3. How the author adds or edits a blog (share this part with Dr. Rashmi)

1. Go to **`yourdomain.com/admin`** and log in with your email + password.
2. Click **Blog Posts → New Blog Post.**
3. Fill in:
   - **Title** — the headline.
   - **Publish date** — newest posts appear first.
   - **Category** — pick from the list (Dogs, Cats, Nutrition, …).
   - **Cover image** — drag in a photo; it shows on the card and atop the article.
   - **Short summary** — one or two lines shown on the homepage card.
   - **Author / Read time** — pre-filled; change if you like.
   - **Body** — write the article. Use the toolbar for headings, **bold**, lists,
     and to drop in more images.
4. Click **Publish.** About a minute later it's live on the site — a new card on the
   homepage and its own page.
5. To change or remove a post, open it from the same screen, edit, and **Publish**
   again (or delete it).

That's it — she never touches code or GitHub.

---

## Notes

- The `npm audit` warnings are in Eleventy's **build-time** tooling only; nothing
  from them ships to visitors.
- To switch the editor from Sveltia CMS to the older Decap CMS, change the one
  `<script>` line in `src/admin/index.html` (the file has the alternative noted in a
  comment). The `config.yml` works with both.
- Want a contact form, newsletter signup, or categories that filter? All doable on
  this same setup — just ask.
