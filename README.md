# anirudhkasugunti.github.io

The personal portfolio of **Anirudh Kasugunti** — a Senior Product Manager who builds 0→1 systems across customer value, shopping experience, and trust. It's a zero-dependency static site — plain HTML, CSS, and JavaScript with no build step or framework — deployed to GitHub Pages.

**Live site:** https://anirudhkasugunti.github.io

## Run locally

The site is fully static, so any file server works. For example:

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

Use a server rather than opening the files directly — relative asset paths and the photo carousel behave correctly under HTTP.

## Structure

- `site/` — the deployable site; this folder is the published root
- `.github/workflows/deploy.yml` — GitHub Actions workflow that publishes `site/` to GitHub Pages on every push to `main`
