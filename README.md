# ovadia-story.uk

A memorial website telling the story of Ovadia, as reported in the newspapers of the 1950s.

The site is fully self-contained: all text lives in `src/pages/Home.jsx` and `src/components/Timeline.jsx`, all images in `public/images/`, and the sounds in `public/sounds/`. It does not depend on any website-builder service.

## How it's published

Every change pushed to the `main` branch is built and published automatically to GitHub Pages (see `.github/workflows/deploy.yml`). The domain is set in `public/CNAME`.

## Running it locally

```
npm install
npm run dev
```
