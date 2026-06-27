#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GAME_DIR = "design/games/01-arma-el-presupuesto-de-el-salvador";
const SOURCE_DIR = join(ROOT, GAME_DIR, "sources/art/wavespeed-production");
const GENERATED_DIR = join(SOURCE_DIR, "generated");
const REMBG_DIR = join(SOURCE_DIR, "background-removed");
const SHEET_DIR = join(SOURCE_DIR, "contact-sheets");
const FINAL_DIR = join(ROOT, "apps/arma-el-presupuesto-de-el-salvador/src/assets/art");
const MANIFEST_PATH = join(SOURCE_DIR, "manifest.json");
const REFERENCE_IMAGE =
  "https://media.githubusercontent.com/media/VertexStudio/hacienda/main/design/games/01-arma-el-presupuesto-de-el-salvador/sources/reference/game-1-reference.png";
const EDIT_ENDPOINT = "https://api.wavespeed.ai/api/v3/openai/gpt-image-2/edit";
const REMBG_ENDPOINT = "https://api.wavespeed.ai/api/v3/wavespeed-ai/image-background-remover";

const BASE_STYLE =
  "Using the provided style-board image only as a visual style reference, create one production-ready asset for a civic education budget game. Friendly semi-flat educational-game illustration, clean shapes, soft rounded forms, soft shadows, bright deep-blue/teal/yellow palette with tasteful coral and purple accents, polished but not photorealistic, no watermark.";
const NO_TEXT = "Do not include text, letters, numbers, labels, logos, UI frames, captions, or currency symbols.";
const ALPHA_STYLE =
  "Transparent-background-friendly standalone asset, centered composition, generous padding, crisp silhouette, no scene background.";

const ASSETS = [
  {
    id: "BG-01",
    filename: "bg_game_shell_2x.webp",
    width: 2360,
    height: 1640,
    alpha: false,
    aspectRatio: "3:2",
    kind: "background",
    prompt:
      `${BASE_STYLE} Full game backdrop only: pale sky to very light blue gradient, subtle San Salvador-inspired mountains, distant simplified city skyline, a few soft clouds and gentle civic-park greenery near the bottom edges. No UI cards, no buttons, no characters, no foreground panel. ${NO_TEXT}`
  },
  {
    id: "BG-02",
    filename: "bg_skyline_overlay_2x.png",
    width: 2360,
    height: 360,
    alpha: true,
    aspectRatio: "16:9",
    resize: "2200x300",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Wide transparent overlay strip: simplified blue mountains behind a small civic city skyline with soft clouds, designed as a top-right decorative layer. ${ALPHA_STYLE} Keep all artwork inside a shallow horizontal band. ${NO_TEXT}`
  },
  {
    id: "SC-01",
    filename: "scene_intro_budget_hero_2x.webp",
    width: 964,
    height: 912,
    alpha: false,
    aspectRatio: "1:1",
    kind: "scene",
    prompt:
      `${BASE_STYLE} Main intro hero illustration for the right-side card: friendly civic building, respectful simplified blue-white-blue El Salvador flag motif, mountains, trees, coins and cash, and three diverse student/citizen characters working together around a budget activity. Complete rectangular scene with soft sky and park background, no UI controls. ${NO_TEXT}`
  },
  {
    id: "SC-02",
    filename: "scene_assignment_side_panel_2x.png",
    width: 360,
    height: 420,
    alpha: true,
    aspectRatio: "3:4",
    resize: "320x380",
    kind: "scene",
    prompt:
      `${BASE_STYLE} Small supportive assignment-panel art: friendly guide character standing beside an open resource vault with coins and a simple budget bar motif. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "SC-03",
    filename: "scene_results_success_2x.png",
    width: 420,
    height: 360,
    alpha: true,
    aspectRatio: "4:3",
    resize: "380x320",
    kind: "scene",
    prompt:
      `${BASE_STYLE} Results support art: small trophy, light civic celebration confetti shapes, coins, and a subtle checkmark motif. ${ALPHA_STYLE} No large scene, no characters. ${NO_TEXT}`
  },
  {
    id: "CH-01",
    filename: "character_student_notebook_full_2x.png",
    width: 640,
    height: 960,
    alpha: true,
    aspectRatio: "2:3",
    resize: "560x900",
    kind: "character",
    prompt:
      `${BASE_STYLE} Full-body Salvadoran student/citizen character holding a notebook or folder, warm curious expression, casual school-friendly outfit, standing pose. ${ALPHA_STYLE} Full body visible from head to shoes. ${NO_TEXT}`
  },
  {
    id: "CH-02",
    filename: "character_student_hoodie_full_2x.png",
    width: 640,
    height: 960,
    alpha: true,
    aspectRatio: "2:3",
    resize: "560x900",
    kind: "character",
    prompt:
      `${BASE_STYLE} Full-body Salvadoran student/citizen character wearing a hoodie, friendly confident expression, casual civic education game style, standing pose. ${ALPHA_STYLE} Full body visible from head to shoes. ${NO_TEXT}`
  },
  {
    id: "CH-03",
    filename: "character_student_glasses_full_2x.png",
    width: 640,
    height: 960,
    alpha: true,
    aspectRatio: "2:3",
    resize: "560x900",
    kind: "character",
    prompt:
      `${BASE_STYLE} Full-body Salvadoran student/citizen character with glasses and overalls or a neat casual outfit, thoughtful friendly expression, standing pose. ${ALPHA_STYLE} Full body visible from head to shoes. ${NO_TEXT}`
  },
  {
    id: "CH-05",
    filename: "character_guide_happy_2x.png",
    width: 512,
    height: 512,
    alpha: true,
    aspectRatio: "1:1",
    resize: "450x450",
    kind: "character",
    prompt:
      `${BASE_STYLE} Shoulders-up guide avatar matching the existing neutral guide: friendly Salvadoran student/citizen, happy encouraging expression, slight celebratory pose. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "CH-06",
    filename: "character_guide_thinking_2x.png",
    width: 512,
    height: 512,
    alpha: true,
    aspectRatio: "1:1",
    resize: "450x450",
    kind: "character",
    prompt:
      `${BASE_STYLE} Shoulders-up guide avatar matching the existing neutral guide: friendly Salvadoran student/citizen, thinking expression, one hand near chin, reflective but approachable. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-01",
    filename: "prop_government_building_2x.png",
    width: 640,
    height: 420,
    alpha: true,
    aspectRatio: "3:2",
    resize: "580x360",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Standalone civic government building motif: clean white and light-blue building, simple columns, small dome shape, warm yellow accents, respectful institutional feel. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-02",
    filename: "prop_el_salvador_flag_2x.png",
    width: 256,
    height: 192,
    alpha: true,
    aspectRatio: "4:3",
    resize: "220x160",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Small respectful simplified El Salvador flag on a short pole, blue-white-blue horizontal bands, no coat of arms details, no lettering, gently waving. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-04",
    filename: "prop_vault_coins_2x.png",
    width: 512,
    height: 512,
    alpha: true,
    aspectRatio: "1:1",
    resize: "450x450",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Standalone resource vault/safe with open door and a few gold coins, friendly rounded game prop, teal and blue safe body, yellow coins. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-05",
    filename: "prop_piggy_bank_2x.png",
    width: 384,
    height: 384,
    alpha: true,
    aspectRatio: "1:1",
    resize: "330x330",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Standalone piggy bank savings prop with small coin shapes, friendly rounded semi-flat game style, teal or coral body, yellow coin accents. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-06",
    filename: "prop_trophy_2x.png",
    width: 384,
    height: 384,
    alpha: true,
    aspectRatio: "1:1",
    resize: "330x330",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Standalone trophy reward prop with soft shine and small civic celebration accents, yellow/gold cup, blue base, game-readable silhouette. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "PR-07",
    filename: "prop_info_badge_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "110x110",
    kind: "prop",
    prompt:
      `${BASE_STYLE} Standalone circular information/help badge icon, friendly blue and teal shape, use a simple abstract dot-and-stem info symbol only, no letters. ${ALPHA_STYLE} No text or alphabetic i.`
  },
  {
    id: "DE-01",
    filename: "deco_cloud_small_2x.png",
    width: 256,
    height: 128,
    alpha: true,
    aspectRatio: "2:1",
    resize: "210x92",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Small soft white cloud decoration, simple rounded semi-flat shape with very light blue shading. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "DE-02",
    filename: "deco_cloud_medium_2x.png",
    width: 384,
    height: 192,
    alpha: true,
    aspectRatio: "2:1",
    resize: "320x142",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Medium soft white cloud decoration, simple rounded semi-flat shape with very light blue shading. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "DE-03",
    filename: "deco_cloud_large_2x.png",
    width: 512,
    height: 256,
    alpha: true,
    aspectRatio: "2:1",
    resize: "430x190",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Large soft white cloud decoration, simple rounded semi-flat shape with very light blue shading. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "DE-04",
    filename: "deco_tree_2x.png",
    width: 256,
    height: 256,
    alpha: true,
    aspectRatio: "1:1",
    resize: "220x220",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Standalone friendly civic park tree decoration, rounded green canopy, simple brown trunk, semi-flat game style. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "DE-05",
    filename: "deco_bush_flowers_2x.png",
    width: 512,
    height: 256,
    alpha: true,
    aspectRatio: "2:1",
    resize: "450x200",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Standalone low bush with small simple flowers for civic park scenes, green rounded foliage with tiny coral/yellow flower accents. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "DE-06",
    filename: "deco_mountain_city_2x.png",
    width: 1400,
    height: 420,
    alpha: true,
    aspectRatio: "16:9",
    resize: "1300x360",
    kind: "decoration",
    prompt:
      `${BASE_STYLE} Wide transparent decorative mountain and city skyline element: soft blue mountains behind a simplified city silhouette and a few trees, shallow horizontal composition. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-02",
    filename: "icon_sector_health_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable health sector game icon: coral heart with a small pulse line motif, clean silhouette, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-03",
    filename: "icon_sector_security_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable public security sector game icon: blue-gray shield with friendly rounded shape and subtle teal accent, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-04",
    filename: "icon_sector_defense_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable national defense sector game icon: respectful helmet or protective emblem silhouette, green and blue-gray accents, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-05",
    filename: "icon_sector_infrastructure_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable infrastructure and transport sector game icon: small bridge or road with construction accent, yellow and teal, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-06",
    filename: "icon_sector_social_programs_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable social programs and development sector game icon: friendly group-of-people symbol with three rounded figures, purple/teal/coral accents, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-07",
    filename: "icon_sector_administration_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable state administration sector game icon: rounded gear and small document shape, teal and deep blue, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-08",
    filename: "icon_sector_transfers_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable transfers and obligations sector game icon: two curved arrows exchanging small abstract resource dots, blue and teal, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "IC-09",
    filename: "icon_sector_debt_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable debt payment sector game icon: small bank or bill with coin stack, yellow and blue, centered. ${ALPHA_STYLE} No currency symbols. ${NO_TEXT}`
  },
  {
    id: "IC-10",
    filename: "icon_sector_legislative_judicial_2x.png",
    width: 128,
    height: 128,
    alpha: true,
    aspectRatio: "1:1",
    resize: "108x108",
    kind: "icon",
    prompt:
      `${BASE_STYLE} Simple readable legislative and judicial sector game icon: scales of justice and small gavel motif, purple and blue, centered. ${ALPHA_STYLE} ${NO_TEXT}`
  },
  {
    id: "UI-01",
    filename: "ui_icon_chevron_right_2x.png",
    width: 64,
    height: 64,
    alpha: true,
    aspectRatio: "1:1",
    resize: "52x52",
    kind: "ui",
    prompt:
      `${BASE_STYLE} Tiny UI icon: bold right chevron arrow mark only, deep blue, rounded friendly shape, centered. ${ALPHA_STYLE} No text, no letters.`
  },
  {
    id: "UI-02",
    filename: "ui_icon_restart_2x.png",
    width: 64,
    height: 64,
    alpha: true,
    aspectRatio: "1:1",
    resize: "52x52",
    kind: "ui",
    prompt:
      `${BASE_STYLE} Tiny UI icon: restart/refresh circular arrow mark only, deep blue with teal accent, rounded friendly shape, centered. ${ALPHA_STYLE} No text, no letters.`
  },
  {
    id: "UI-03",
    filename: "ui_icon_info_2x.png",
    width: 64,
    height: 64,
    alpha: true,
    aspectRatio: "1:1",
    resize: "52x52",
    kind: "ui",
    prompt:
      `${BASE_STYLE} Tiny UI icon: abstract information/help symbol with a dot and vertical stem inside a circle, deep blue and teal, centered. ${ALPHA_STYLE} No alphabetic letters, no text.`
  },
  {
    id: "UI-04",
    filename: "ui_icon_lightbulb_2x.png",
    width: 64,
    height: 64,
    alpha: true,
    aspectRatio: "1:1",
    resize: "52x52",
    kind: "ui",
    prompt:
      `${BASE_STYLE} Tiny UI icon: lightbulb tips symbol only, yellow bulb with deep blue outline, rounded friendly shape, centered. ${ALPHA_STYLE} No text, no letters.`
  },
  {
    id: "UI-05",
    filename: "ui_icon_star_2x.png",
    width: 64,
    height: 64,
    alpha: true,
    aspectRatio: "1:1",
    resize: "52x52",
    kind: "ui",
    prompt:
      `${BASE_STYLE} Tiny UI icon: friendly five-point star reward accent, yellow with subtle blue shadow, centered. ${ALPHA_STYLE} No text, no letters.`
  }
];

const KNOWN_ASPECTS = new Set(["1:1", "2:3", "3:2", "3:4", "4:3", "16:9", "2:1"]);

function ensureDirs() {
  [SOURCE_DIR, GENERATED_DIR, REMBG_DIR, SHEET_DIR, FINAL_DIR].forEach((dir) => mkdirSync(dir, { recursive: true }));
}

function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return {
      referenceImage: REFERENCE_IMAGE,
      editEndpoint: EDIT_ENDPOINT,
      backgroundRemoverEndpoint: REMBG_ENDPOINT,
      generatedAt: null,
      jobs: {}
    };
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function saveManifest(manifest) {
  manifest.updatedAt = new Date().toISOString();
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

function rel(path) {
  return relative(ROOT, path);
}

function baseName(asset) {
  return asset.filename.replace(/\.(png|webp)$/i, "");
}

function generatedPath(asset) {
  return join(GENERATED_DIR, `${baseName(asset)}.wavespeed.png`);
}

function rembgPath(asset) {
  return join(REMBG_DIR, `${baseName(asset)}.rembg.png`);
}

function finalPath(asset) {
  return join(FINAL_DIR, asset.filename);
}

function assetByToken(token) {
  return ASSETS.find((asset) => asset.id === token || asset.filename === token);
}

function selectedAssets(args) {
  const tokens = args.filter((arg) => !arg.startsWith("--"));
  if (!tokens.length) return ASSETS;
  return tokens.map((token) => {
    const asset = assetByToken(token);
    if (!asset) throw new Error(`Unknown asset: ${token}`);
    return asset;
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apiKey() {
  loadEnv();
  if (!process.env.WAVESPEED_API_KEY) throw new Error("WAVESPEED_API_KEY missing from environment or .env");
  return process.env.WAVESPEED_API_KEY;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 400)}`);
  }
  if (!response.ok) {
    const message = payload.message || payload.error || text;
    throw new Error(`HTTP ${response.status} from ${url}: ${message}`);
  }
  return payload;
}

function outputUrl(payload) {
  const data = payload.data ?? payload;
  const candidates = [
    data.output,
    data.outputs,
    data.images,
    data.urls?.output,
    data.urls?.outputs,
    data.result,
    data.results
  ].flat().filter(Boolean);
  return candidates.find((value) => typeof value === "string" && /^https?:\/\//.test(value));
}

function getUrl(payload) {
  return payload.data?.urls?.get || payload.urls?.get || payload.data?.get_url || payload.get_url;
}

function predictionId(payload) {
  const data = payload.data ?? payload;
  return data.id || data.prediction_id || data.predictionId || data.task_id || data.taskId || null;
}

async function poll(url, key, label) {
  for (let attempt = 1; attempt <= 72; attempt += 1) {
    const payload = await requestJson(url, {
      headers: { Authorization: `Bearer ${key}` }
    });
    const status = payload.data?.status || payload.status;
    const urlOut = outputUrl(payload);
    if (status === "completed" && urlOut) return { payload, outputUrl: urlOut };
    if (status === "failed" || status === "error") {
      throw new Error(`${label} failed: ${JSON.stringify(payload)}`);
    }
    await sleep(5000);
  }
  throw new Error(`${label} did not complete within polling window`);
}

async function download(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  writeFileSync(path, bytes);
}

async function generateAsset(asset, manifest, key, force) {
  const outPath = generatedPath(asset);
  const existing = manifest.jobs[asset.filename]?.generation?.outputUrl;
  if (!force && existing && existsSync(outPath)) {
    console.log(`skip generate ${asset.filename}`);
    return;
  }

  if (!KNOWN_ASPECTS.has(asset.aspectRatio)) throw new Error(`Unsupported local aspect ratio: ${asset.aspectRatio}`);
  console.log(`generate ${asset.filename}`);
  const submitted = await requestJson(EDIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      prompt: asset.prompt,
      images: [REFERENCE_IMAGE],
      aspect_ratio: asset.aspectRatio,
      resolution: "1k",
      quality: "low",
      output_format: "png",
      enable_sync_mode: false,
      enable_base64_output: false
    })
  });
  const pollUrl = getUrl(submitted);
  if (!pollUrl) throw new Error(`No polling URL for ${asset.filename}: ${JSON.stringify(submitted)}`);
  const completed = await poll(pollUrl, key, `generation ${asset.filename}`);
  await download(completed.outputUrl, outPath);
  manifest.jobs[asset.filename] = {
    ...(manifest.jobs[asset.filename] ?? {}),
    id: asset.id,
    filename: asset.filename,
    width: asset.width,
    height: asset.height,
    alpha: asset.alpha,
    prompt: asset.prompt,
    generation: {
      predictionId: predictionId(submitted),
      getUrl: pollUrl,
      outputUrl: completed.outputUrl,
      localPath: rel(outPath),
      completedAt: new Date().toISOString()
    }
  };
  saveManifest(manifest);
}

async function removeBackground(asset, manifest, key, force) {
  if (!asset.alpha) return;
  const outPath = rembgPath(asset);
  const job = manifest.jobs[asset.filename];
  const sourceUrl = job?.generation?.outputUrl;
  if (!sourceUrl) throw new Error(`No generation output URL for ${asset.filename}`);
  if (!force && job.backgroundRemoval?.outputUrl && existsSync(outPath)) {
    console.log(`skip remove-bg ${asset.filename}`);
    return;
  }
  console.log(`remove-bg ${asset.filename}`);
  const submitted = await requestJson(REMBG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      image: sourceUrl,
      enable_sync_mode: false,
      enable_base64_output: false
    })
  });
  const pollUrl = getUrl(submitted);
  if (!pollUrl) throw new Error(`No polling URL for bg remover ${asset.filename}: ${JSON.stringify(submitted)}`);
  const completed = await poll(pollUrl, key, `background removal ${asset.filename}`);
  await download(completed.outputUrl, outPath);
  manifest.jobs[asset.filename] = {
    ...job,
    backgroundRemoval: {
      predictionId: predictionId(submitted),
      getUrl: pollUrl,
      outputUrl: completed.outputUrl,
      localPath: rel(outPath),
      completedAt: new Date().toISOString()
    }
  };
  saveManifest(manifest);
}

function runMagick(args) {
  execFileSync("magick", args, { cwd: ROOT, stdio: "inherit" });
}

function exportAsset(asset, manifest) {
  const outPath = finalPath(asset);
  const inputPath = asset.alpha ? rembgPath(asset) : generatedPath(asset);
  if (!existsSync(inputPath)) throw new Error(`Missing input for export: ${rel(inputPath)}`);
  console.log(`export ${asset.filename}`);
  if (asset.alpha) {
    const resize = asset.resize || `${Math.round(asset.width * 0.88)}x${Math.round(asset.height * 0.88)}`;
    runMagick([
      inputPath,
      "-alpha",
      "on",
      "-trim",
      "+repage",
      "-resize",
      resize,
      "-background",
      "none",
      "-gravity",
      "center",
      "-extent",
      `${asset.width}x${asset.height}`,
      outPath
    ]);
  } else {
    runMagick([
      inputPath,
      "-resize",
      `${asset.width}x${asset.height}^`,
      "-gravity",
      "center",
      "-extent",
      `${asset.width}x${asset.height}`,
      "-quality",
      "88",
      outPath
    ]);
  }
  manifest.jobs[asset.filename] = {
    ...(manifest.jobs[asset.filename] ?? {}),
    export: {
      localPath: rel(outPath),
      width: asset.width,
      height: asset.height,
      alpha: asset.alpha,
      exportedAt: new Date().toISOString()
    }
  };
  saveManifest(manifest);
}

function identify(path) {
  return execFileSync(
    "magick",
    ["identify", "-format", "%f %[channels] alpha-min=%[fx:minima.a] alpha-max=%[fx:maxima.a] size=%wx%h", path],
    { cwd: ROOT, encoding: "utf8" }
  );
}

function validateAssets(assets) {
  for (const asset of assets) {
    const path = finalPath(asset);
    if (!existsSync(path)) {
      console.log(`missing ${asset.filename}`);
      continue;
    }
    console.log(identify(path));
  }
}

function makeSheet(assets, name = "game1-final-assets-contact-sheet.png") {
  const existing = assets.map(finalPath).filter((path) => existsSync(path));
  if (!existing.length) throw new Error("No final assets available for contact sheet");
  const outPath = join(SHEET_DIR, name);
  const args = [
    "montage",
    ...existing,
    "-label",
    "%f",
    "-thumbnail",
    "180x180>",
    "-background",
    "#f7fafc",
    "-fill",
    "#092154",
    "-font",
    "Arial",
    "-pointsize",
    "16",
    "-geometry",
    "220x230+14+14",
    outPath
  ];
  console.log(`sheet ${rel(outPath)}`);
  runMagick(args);
}

async function main() {
  ensureDirs();
  const [command = "list", ...args] = process.argv.slice(2);
  const force = args.includes("--force");
  const assets = selectedAssets(args);
  const manifest = loadManifest();
  if (command === "list") {
    for (const asset of assets) {
      const status = existsSync(finalPath(asset)) ? "final" : "missing";
      console.log(`${status.padEnd(7)} ${asset.id} ${asset.filename} ${asset.width}x${asset.height} alpha=${asset.alpha}`);
    }
    return;
  }
  if (command === "missing") {
    for (const asset of ASSETS.filter((item) => !existsSync(finalPath(item)))) {
      console.log(`${asset.id} ${asset.filename}`);
    }
    return;
  }
  if (command === "generate") {
    const key = apiKey();
    for (const asset of assets) await generateAsset(asset, manifest, key, force);
    return;
  }
  if (command === "remove-bg") {
    const key = apiKey();
    for (const asset of assets) await removeBackground(asset, manifest, key, force);
    return;
  }
  if (command === "export") {
    for (const asset of assets) exportAsset(asset, manifest);
    return;
  }
  if (command === "sheet") {
    makeSheet(ASSETS);
    return;
  }
  if (command === "validate") {
    validateAssets(assets);
    return;
  }
  if (command === "all") {
    const key = apiKey();
    for (const asset of assets) {
      await generateAsset(asset, manifest, key, force);
      await removeBackground(asset, manifest, key, force);
      exportAsset(asset, manifest);
    }
    makeSheet(ASSETS);
    validateAssets(ASSETS);
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
