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

### 3. Enable Google Sign-In on your GitHub Pages domain (Firebase)

To allow Google Sign-In cloud saves on your live GitHub Pages site:
1. Open the [Firebase Console](https://console.firebase.google.com/) for project `advance-eon-mk4jk`.
2. Go to **Authentication → Settings → Authorized domains**.
3. Click **Add domain** and add `<YOUR_USERNAME>.github.io`.
