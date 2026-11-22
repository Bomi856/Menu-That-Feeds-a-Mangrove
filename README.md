# Menu That Feeds a Mangrove

Bang Khun Thian Coastal Eco-Cafe & Mangrove Tomodachi game built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

## Local Development

```bash
npm install
npm run dev
```

## Deploying to GitHub & GitHub Pages

This repository includes a preconfigured GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds `dist/` with the correct repository subpath (`VITE_BASE_PATH`) and publishes automatically to **GitHub Pages**.

### 1. Push the project to a GitHub repository

```bash
git init
git add .
git commit -m "Initial commit: Menu That Feeds a Mangrove"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Open your repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. The **Deploy to GitHub Pages** workflow will run automatically (or trigger it manually under **Actions → Deploy to GitHub Pages → Run workflow**).
4. Once complete, your live app URL will appear at `https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/`.

### 3. Connect Your Own Custom Domain (Optional)

You can publish the game on your own domain (for example `mangrovecafe.com` or `play.yourdomain.com`) via **GitHub Pages**, **Cloudflare Pages**, **Vercel**, or **Netlify**:

#### Option A: Custom Domain on GitHub Pages
1. In your GitHub repo, open **Settings → Pages → Custom domain**, enter your domain (e.g., `play.yourdomain.com` or `yourdomain.com`), and click **Save**.
   - *(Tip: GitHub automatically manages `CNAME`, and `.github/workflows/deploy.yml` uses `actions/configure-pages@v5`, which automatically switches `VITE_BASE_PATH` to `/` for custom domains.)*
2. At your domain registrar (Cloudflare, Namecheap, GoDaddy, Squarespace, Porkbun, etc.), add DNS records:
   - **Subdomain (`www.yourdomain.com` / `play.yourdomain.com`):** Add a `CNAME` record pointing to `<YOUR_USERNAME>.github.io`.
   - **Root/apex domain (`yourdomain.com`):** Add four `A` records pointing to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
3. Wait for DNS propagation, then check **Enforce HTTPS** under **Settings → Pages**.

#### Option B: Vercel / Netlify / Cloudflare Pages
1. Connect your GitHub repository in Vercel, Netlify, or Cloudflare Pages.
2. Set **Build command** to `npm run build` and **Output directory** to `dist`.
3. Add your custom domain in the host's **Domains** settings and point your DNS as prompted.

### 4. Optional Cloud Save (Firebase) Without Committing Keys

`firebase-applet-config.json` is listed in `.gitignore` so API keys are never pushed to GitHub. The game works cleanly with browser local storage even without Firebase secrets configured.

To enable Google Sign-In cloud saves on your live site:
1. In your GitHub repo, go to **Settings → Secrets and variables → Actions** and add repository secrets matching `.env.example` (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_DATABASE_ID`).
2. Open the [Firebase Console](https://console.firebase.google.com/) for your project → **Authentication → Settings → Authorized domains** and add `<YOUR_USERNAME>.github.io` and your custom domain.
3. In [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials), restrict your browser API key by **HTTP referrers** (only your domains) and **API restrictions** (only Identity Toolkit / Firestore).

