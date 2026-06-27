# Wavespeed Image Generation Notes

Model page: https://wavespeed.ai/models/openai/gpt-image-2/edit

This repo uses Wavespeed for reference-guided image generation experiments. The local API key is expected in `.env` as `WAVESPEED_API_KEY`.

Do not commit `.env`, print the key, or paste the key into tracked files.

For one-off local scripts, load the key into the shell before running Node:

```sh
set -a
source .env
set +a
node your-wavespeed-script.mjs
```

Alternatively, parse `.env` inside the script. Do not add a tracked dependency just to read this key unless the project already needs it.

## Model Endpoint

Use:

```text
POST https://api.wavespeed.ai/api/v3/openai/gpt-image-2/edit
```

Required headers:

```text
Authorization: Bearer $WAVESPEED_API_KEY
Content-Type: application/json
```

The edit model accepts reference images through an `images` array. Use publicly reachable URLs, not local filesystem paths.

For Git LFS images in this repo, prefer the `media.githubusercontent.com` URL form:

```text
https://media.githubusercontent.com/media/VertexStudio/hacienda/main/design/games/01-arma-el-presupuesto-de-el-salvador/sources/reference/game-1-reference.png
```

Observed issue: the GitHub Pages URL for the same LFS image returned only a 132-byte LFS pointer, not the actual 1.7 MB image. Do not use the Pages URL for Wavespeed reference images unless you verify byte size first.

## Recommended Request Shape

Async mode is recommended because sync mode can time out.

```js
const response = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-2/edit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WAVESPEED_API_KEY}`
  },
  body: JSON.stringify({
    prompt: "Using the provided style-board image only as a visual style reference, create ...",
    images: [
      "https://media.githubusercontent.com/media/VertexStudio/hacienda/main/design/games/01-arma-el-presupuesto-de-el-salvador/sources/reference/game-1-reference.png"
    ],
    aspect_ratio: "1:1",
    resolution: "1k",
    quality: "low",
    output_format: "png",
    enable_sync_mode: false,
    enable_base64_output: false
  })
});
```

Poll the returned `data.urls.get` URL with the same `Authorization` header until `data.status` is `completed`.

## Local Test Outputs

Test outputs are stored under:

```text
design/games/01-arma-el-presupuesto-de-el-salvador/sources/art/wavespeed-tests/
```

Generated files:

- `icon_sector_education_2x.test.png`
- `prop_coin_cash_stack_2x.test.png`
- `character_guide_neutral_2x.test.png`
- `manifest.json`

These are proof-of-life assets, not final production art.

## What Worked

- The model accepted the Game 1 reference image when using the `media.githubusercontent.com` URL.
- Async submit-and-poll mode completed successfully for the coin/cash prop and guide character.
- The reference image influenced the general polished educational-game look.
- The education icon and guide avatar are visually close enough to prove the workflow can produce useful style-directed candidates.
- Generated PNG files are covered by the repo's Git LFS rules.

## What Did Not Work Or Needs Care

- `enable_sync_mode: true` is not reliable for this workflow. One sync request completed, but the next request returned `504 Gateway Time-out`.
- The first sync run saved `icon_sector_education_2x.test.png`, but the script crashed on the next sync request before writing the manifest. The manifest marks that icon as a recovered local output.
- `resolution: "1k"` does not return the exact art-inventory target sizes:
  - `1:1` returned `1024 x 1024`.
  - `4:3` returned `1536 x 1024`.
  - We must resize/crop outputs to the exact inventory sizes before production use.
- Transparent background prompting was not reliable:
  - The education icon and guide avatar were RGB PNGs with light/white backgrounds.
  - The coin/cash prop was RGBA, but still had a visible rendered background.
  - Production pipeline needs a background-removal/post-processing step or stricter prompt testing.
- The coin/cash prop came out more 3D/rendered than the reference board and included currency-like symbols on coins. For final prompts, explicitly request `semi-flat vector-like illustration`, `no letters`, `no currency symbols`, and `transparent background`.

## Prompt Guidance

Good base structure:

```text
Using the provided style-board image only as a visual style reference, create one [asset type] for a civic education budget game. Friendly semi-flat illustration, clean shapes, soft shadows, bright blue/teal/yellow palette, no text, no letters, no UI frame, transparent background, centered composition, suitable for [target size] export.
```

For icons:

```text
simple readable game icon, centered, no detailed scene, no text, no letters, no UI frame
```

For props:

```text
standalone prop, semi-flat vector-like style, soft shadow only under object, no background scene, no currency symbols, no text
```

For characters:

```text
friendly Salvadoran student/citizen guide, same polished semi-flat educational-game style as reference, shoulders-up avatar, warm expression, no text
```

## Minimal Polling Pattern

```js
async function pollWavespeed(getUrl, apiKey) {
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const response = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const payload = await response.json();
    if (payload.data?.status === "completed") return payload;
    if (payload.data?.status === "failed") throw new Error(JSON.stringify(payload));
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error(`Wavespeed task did not complete: ${getUrl}`);
}
```
