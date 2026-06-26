# Hacienda

Browser game prototype built with Phaser, TypeScript, and Vite.

## Development

```sh
npm install
npm run dev
```

The editable game source lives in `game/`.

## GitHub Pages

```sh
npm run build
```

The build writes the static Pages entry point to `index.html` and generated
assets to `assets/`, so GitHub Pages can serve the game from the `main` branch
root without requiring GitHub Actions.
