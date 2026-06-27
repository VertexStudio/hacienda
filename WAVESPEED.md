# Wavespeed Image Generation Notes

Model page: https://wavespeed.ai/models/openai/gpt-image-2/edit
Background remover: https://wavespeed.ai/models/wavespeed-ai/image-background-remover

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

For reference-guided generation, use:

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

For AI background removal, use:

```text
POST https://api.wavespeed.ai/api/v3/wavespeed-ai/image-background-remover
```

Request body:

```json
{
  "image": "https://media.githubusercontent.com/media/VertexStudio/hacienda/main/path/to/source.png",
  "enable_sync_mode": false,
  "enable_base64_output": false
}
```

This endpoint also uses the async `data.urls.get` polling pattern.

## Tool Boundary

Use AI models for:

- Generating new artwork.
- Reference-guided style transfer or semantic edits.
- Background removal / segmentation.
- Meaningful visual changes that require interpretation.

Use local tools only for deterministic post-processing:

- Crop.
- Resize / scale.
- Pad canvas.
- Convert file formats.
- Compress.
- Check dimensions, alpha channels, and metadata.

Available local tools in this workspace:

- ImageMagick: `magick`, `convert`
- Video/image utility: `ffmpeg`
- macOS image utility: `sips`
- Python package runner: `uv`

Do not use local tools as a substitute for AI tasks such as object generation, segmentation decisions, or style conversion. Use them after the model output exists and the operation is mechanical.

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
- `background-removed/icon_sector_education_2x.rembg.test.png`
- `background-removed/prop_coin_cash_stack_2x.rembg.test.png`
- `background-removed/character_guide_neutral_2x.rembg.test.png`
- `background-removed/manifest.json`

These are proof-of-life assets, not final production art.

Game-ready validation exports are stored under:

```text
apps/arma-el-presupuesto-de-el-salvador/src/assets/art/
```

Integrated files:

- `icon_sector_education_2x.png` at `128 x 128`
- `prop_coin_cash_stack_2x.png` at `512 x 384`
- `character_guide_neutral_2x.png` at `512 x 512`

Review contact sheet:

```text
design/games/01-arma-el-presupuesto-de-el-salvador/sources/art/wavespeed-tests/contact-sheets/final-assets-contact-sheet.png
```

## Production Batch Workflow

Production Game 1 art is generated with:

```sh
node scripts/generate-game1-art.mjs all
```

Useful commands:

```sh
node scripts/generate-game1-art.mjs missing
node scripts/generate-game1-art.mjs generate IC-02
node scripts/generate-game1-art.mjs remove-bg IC-02
node scripts/generate-game1-art.mjs export IC-02
node scripts/generate-game1-art.mjs sheet
node scripts/generate-game1-art.mjs validate
```

Use `--force` to regenerate or re-export a specific asset:

```sh
node scripts/generate-game1-art.mjs generate DE-01 --force
node scripts/generate-game1-art.mjs remove-bg DE-01 --force
node scripts/generate-game1-art.mjs export DE-01 --force
```

Production source files are stored under:

```text
design/games/01-arma-el-presupuesto-de-el-salvador/sources/art/wavespeed-production/
```

Important files:

- `manifest.json`: prompt, output URL, remover URL, and export metadata.
- `generated/*.wavespeed.png`: raw gpt-image-2/edit results.
- `background-removed/*.rembg.png`: Wavespeed background-remover outputs.
- `contact-sheets/game1-final-assets-contact-sheet.png`: visual review sheet for the production batch.

Final game exports are stored under:

```text
apps/arma-el-presupuesto-de-el-salvador/src/assets/art/
```

Production status:

- All **39** `art-inventory.md` exports now exist in the final game asset folder.
- All transparent PNG exports validated with real alpha:
  - `alpha-min=0`
  - `alpha-max=1`
- All exports validated at the exact inventory dimensions.
- The production batch was committed in category checkpoints so the manifest can be resumed safely.

## What Worked

- The model accepted the Game 1 reference image when using the `media.githubusercontent.com` URL.
- Async submit-and-poll mode completed successfully for the coin/cash prop and guide character.
- The reference image influenced the general polished educational-game look.
- The education icon and guide avatar are visually close enough to prove the workflow can produce useful style-directed candidates.
- Generated PNG files are covered by the repo's Git LFS rules.
- The Wavespeed background remover completed successfully on all three generated test images.
- Background remover outputs are RGBA PNGs with real transparent pixels:
  - `alpha-min=0`
  - `alpha-max=1`
- Deterministic post-processing completed successfully with ImageMagick:
  - Cropped transparent padding.
  - Resized/padded to exact art-inventory dimensions.
  - Preserved alpha channels.
- Phaser/Vite integration completed successfully:
  - `icon_sector_education_2x.png` is loaded and rendered in the sector list/chart.
  - `prop_coin_cash_stack_2x.png` is loaded and rendered in the intro hero.
  - `character_guide_neutral_2x.png` is loaded and rendered in the assignment feedback panel.
- `npm run build` bundled the imported PNG assets into the GitHub Pages output.
- GitHub Pages PNG outputs are explicitly excluded from Git LFS in `.gitattributes` so the browser receives real images instead of LFS pointer files.
- The production script can resume partial runs:
  - Existing generation and background-removal jobs are skipped unless `--force` is provided.
  - Existing final exports are skipped unless `--force` is provided.
- Targeted prompt retries worked well for production misses:
  - The flag prop became a clean standalone blue-white-blue flag after adding explicit "only the flag and pole" constraints.
  - Cloud decorations became standalone clouds after adding explicit "only the cloud" constraints and negative lists.

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
  - Production pipeline should treat background removal as a separate AI step instead of relying on the generation prompt.
- The coin/cash prop came out more 3D/rendered than the reference board and included currency-like symbols on coins. For final prompts, explicitly request `semi-flat vector-like illustration`, `no letters`, `no currency symbols`, and `transparent background`.
- Background remover fixes the alpha channel but does not resize, crop, or restyle the image. Use local tools only after removal for deterministic canvas fitting.
- Broad style-board prompts can over-compose simple assets:
  - The first flag retry produced a full civic mini-scene instead of a standalone flag.
  - The first cloud pass produced civic mini-scenes instead of cloud decorations.
  - For simple props/decorations, say `Isolated prop only` or `Isolated decoration only`, then list forbidden objects such as people, buildings, coins, flags, landscapes, charts, and UI.
- The info-style UI/icon prompts may still produce a familiar lowercase `i` shape. That is acceptable for UI use, but do not rely on the model to avoid letter-like symbols unless the asset specifically needs a non-letter abstract mark.

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

## Deterministic Post-Processing Examples

Use these only after AI generation/removal has produced an acceptable image.

Check dimensions and alpha:

```sh
magick identify -format '%f %[channels] alpha-min=%[fx:minima.a] alpha-max=%[fx:maxima.a] size=%wx%h\n' path/to/image.png
```

Resize to an art-inventory target:

```sh
magick input.png -resize 128x128 -background none -gravity center -extent 128x128 output.png
```

Crop transparent padding:

```sh
magick input.png -trim +repage output.png
```

End-to-end test command used for exact exports:

```sh
magick input.rembg.png -trim +repage -resize 112x112 -background none -gravity center -extent 128x128 output.png
```

Adjust the `-resize` and `-extent` values per `art-inventory.md`.
