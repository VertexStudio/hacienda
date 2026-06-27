# Game 1 Art Inventory

Reference style: `sources/reference/game-1-reference.png`  
Style guide: `style-guide.md`  
Game canvas: `1180 x 820` logical pixels

## Production Rules

- Create all artwork in the friendly semi-flat civic education style from the reference.
- Use the reference palette from `style-guide.md`.
- Do not bake UI text into images. Text stays in the game for localization and layout control.
- Deliver final game exports at the exact source sizes below. These are mostly `2x` sizes for crisp browser rendering.
- Use transparent PNG for characters, icons, and props. Use WebP or PNG for full rectangular backgrounds.
- Keep important content away from the outer 24 px of each source image unless the asset is meant to bleed to the edge.

## Folder Targets

- Source/reference art: `design/games/01-arma-el-presupuesto-de-el-salvador/sources/art/`
- Final game exports: `apps/arma-el-presupuesto-de-el-salvador/src/assets/art/`

## Required Assets

### Backgrounds And Screen Art

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Use |
| --- | --- | ---: | ---: | --- | --- | --- |
| BG-01 | `bg_game_shell_2x.webp` | `2360 x 1640` | `1180 x 820` | WebP | No | Full game backdrop: pale sky/blue gradient with subtle mountains/city/clouds. No UI cards or text. |
| BG-02 | `bg_skyline_overlay_2x.png` | `2360 x 360` | `1180 x 180` | PNG | Yes | Optional top/right decorative skyline layer if BG-01 is kept simpler. |
| SC-01 | `scene_intro_budget_hero_2x.webp` | `964 x 912` | `482 x 456` | WebP | No | Main intro illustration inside the right-side card: civic building, El Salvador flag, mountains, trees, coins/cash, three students. No text. |
| SC-02 | `scene_assignment_side_panel_2x.png` | `360 x 420` | `180 x 210` | PNG | Yes | Small supportive art for assignment/feedback: guide character with vault/coins. |
| SC-03 | `scene_results_success_2x.png` | `420 x 360` | `210 x 180` | PNG | Yes | Results/comparison support art: trophy, light civic celebration, coins. |

### Characters

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Use |
| --- | --- | ---: | ---: | --- | --- | --- |
| CH-01 | `character_student_notebook_full_2x.png` | `640 x 960` | `160 x 240` | PNG | Yes | Student character with notebook/folder for intro hero and future guidance scenes. |
| CH-02 | `character_student_hoodie_full_2x.png` | `640 x 960` | `160 x 240` | PNG | Yes | Student character with hoodie for intro hero and future guidance scenes. |
| CH-03 | `character_student_glasses_full_2x.png` | `640 x 960` | `160 x 240` | PNG | Yes | Student character with glasses/overalls for intro hero and future guidance scenes. |
| CH-04 | `character_guide_neutral_2x.png` | `512 x 512` | `96 x 96` or `128 x 128` | PNG | Yes | Guide avatar for neutral explanations and tooltips. |
| CH-05 | `character_guide_happy_2x.png` | `512 x 512` | `96 x 96` or `128 x 128` | PNG | Yes | Guide avatar for good budget choices and positive feedback. |
| CH-06 | `character_guide_thinking_2x.png` | `512 x 512` | `96 x 96` or `128 x 128` | PNG | Yes | Guide avatar for warnings, tradeoffs, and reflection prompts. |

### Civic Props

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Use |
| --- | --- | ---: | ---: | --- | --- | --- |
| PR-01 | `prop_government_building_2x.png` | `640 x 420` | `320 x 210` | PNG | Yes | Main government building motif. |
| PR-02 | `prop_el_salvador_flag_2x.png` | `256 x 192` | `64 x 48` | PNG | Yes | Small flag on pole/waving flag. |
| PR-03 | `prop_coin_cash_stack_2x.png` | `512 x 384` | `128 x 96` | PNG | Yes | Money stack for budget/resources visuals. |
| PR-04 | `prop_vault_coins_2x.png` | `512 x 512` | `160 x 160` | PNG | Yes | Vault/safe with coins for surplus/bóveda visuals. |
| PR-05 | `prop_piggy_bank_2x.png` | `384 x 384` | `96 x 96` | PNG | Yes | Savings/surplus icon for smaller panels. |
| PR-06 | `prop_trophy_2x.png` | `384 x 384` | `96 x 96` | PNG | Yes | Results/reward moment. |
| PR-07 | `prop_info_badge_2x.png` | `128 x 128` | `32 x 32` | PNG | Yes | Info/help badge if we replace drawn info markers. |

### Environment Decorations

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Use |
| --- | --- | ---: | ---: | --- | --- | --- |
| DE-01 | `deco_cloud_small_2x.png` | `256 x 128` | `128 x 64` | PNG | Yes | Small cloud decoration. |
| DE-02 | `deco_cloud_medium_2x.png` | `384 x 192` | `192 x 96` | PNG | Yes | Medium cloud decoration. |
| DE-03 | `deco_cloud_large_2x.png` | `512 x 256` | `256 x 128` | PNG | Yes | Large cloud decoration. |
| DE-04 | `deco_tree_2x.png` | `256 x 256` | `80 x 80` or `128 x 128` | PNG | Yes | Tree decoration for civic park scenes. |
| DE-05 | `deco_bush_flowers_2x.png` | `512 x 256` | `160 x 80` or `256 x 128` | PNG | Yes | Ground/park detail for hero art. |
| DE-06 | `deco_mountain_city_2x.png` | `1400 x 420` | `700 x 210` | PNG | Yes | Mountains and city skyline element for hero/background compositions. |

### Sector Icons

All sector icons should be simple, consistent, and readable at small sizes.

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Sector |
| --- | --- | ---: | ---: | --- | --- | --- |
| IC-01 | `icon_sector_education_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Educación: book or graduation cap. |
| IC-02 | `icon_sector_health_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Salud: heart/pulse. |
| IC-03 | `icon_sector_security_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Seguridad Pública: shield. |
| IC-04 | `icon_sector_defense_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Defensa Nacional: helmet or soldier silhouette. |
| IC-05 | `icon_sector_infrastructure_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Infraestructura y transporte: bridge/road/construction. |
| IC-06 | `icon_sector_social_programs_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Programas sociales y desarrollo: group of people. |
| IC-07 | `icon_sector_administration_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Administración del Estado: gear. |
| IC-08 | `icon_sector_transfers_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Transferencias y obligaciones: bidirectional arrows. |
| IC-09 | `icon_sector_debt_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Pago de deuda: coin/bill/bank. |
| IC-10 | `icon_sector_legislative_judicial_2x.png` | `128 x 128` | `28 x 28` | PNG | Yes | Órganos Legislativo y Judicial: scales/gavel. |

### Small UI Icons

These are not full UI components; the cards, buttons, sliders, and bars stay code-rendered.

| ID | Filename | Exact Source Size | Runtime Display | Format | Alpha | Use |
| --- | --- | ---: | ---: | --- | --- | --- |
| UI-01 | `ui_icon_chevron_right_2x.png` | `64 x 64` | `20 x 20` | PNG | Yes | Primary button arrow. |
| UI-02 | `ui_icon_restart_2x.png` | `64 x 64` | `20 x 20` | PNG | Yes | Restart button. |
| UI-03 | `ui_icon_info_2x.png` | `64 x 64` | `20 x 20` | PNG | Yes | Info/help action. |
| UI-04 | `ui_icon_lightbulb_2x.png` | `64 x 64` | `20 x 20` | PNG | Yes | Tips/consejos action. |
| UI-05 | `ui_icon_star_2x.png` | `64 x 64` | `16 x 16` | PNG | Yes | Learning note/reward accent. |

## Delivery Count

Required production set: **39 image exports**

- 5 background/screen assets
- 6 character assets
- 7 civic props
- 6 environment decorations
- 10 sector icons
- 5 small UI icons

## Notes For Generation

- The intro hero can be generated as one composed image (`SC-01`) first. The separate character and prop assets are still useful for future screens, animation, and reuse.
- Keep character styling consistent: same line weight, facial proportions, lighting, and semi-flat rendering.
- Avoid photorealism. Use clean shapes, soft shading, and educational-game readability.
- Avoid national symbols that look altered or unofficial; use a respectful simplified El Salvador flag motif.
