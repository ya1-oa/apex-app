# WITHERS / Death Broker
## Interface System · Edition 02 · 2026-10-09

A quiet, elegant command system for work, schedule, money, and craft. Built to be a daily-use mobile tool, not a motivational poster.

### References studied
- **Notion mobile:** one home destination, simple recent/important navigation, minimal visual clutter. Official May 2026 home release: https://www.notion.com/releases/2026-05-04
- **Google Calendar:** scheduled commitments have visible time, duration, and clear categories. Official UX documentation: https://support.google.com/calendar/answer/6110849
- **Todoist:** Today shows concrete tasks, checks, and priority; all projects roll into one clear daily queue. Official documentation: https://www.todoist.com/help/todoist/get-started/plan-your-day-with-the-today-view-UVUXaiSs
- **Courier Radar:** the user's existing spacing, native restraint, tap-target, single source of CSS truth, component contracts: https://github.com/ya1-oa/courier-radar/blob/main/DESIGN_SYSTEM.md
- **Withers / Death Broker existing visual identity:** black/charcoal, bone/ivory, silver/stone, controlled oxblood/crimson; dark editorial and neo-gothic restraint. No neon or random cyberpunk RGB colors.

### Colors (CSS tokens only)
| Role | Hex | Semantic use |
|---|---|---|
| `--page` | `#F1EFE9` | Warm stone background, less harsh than pure white |
| `--paper` | `#FAF9F6` | Content surface |
| `--ink` | `#222126` | Primary type, deep charcoal |
| `--ink-soft` | `#414047` | Secondary type |
| `--ash` | `#6F6C73` | Metadata |
| `--hairline` | `#D9D5CE` | Separators only |
| `--oxblood` | `#752B38` | Selective active / high-value action |
| `--oxblood-fade` | `#F5E9EA` | Selected state wash |
| `--good` | `#496656` | Semantic completion only |
| `--silver` | `#B2B0B5` | Neutral marker |

No greens except semantic completed states. No lime, cyan, cobalt, glowing accents or gradient cards.

### Type
- Content: native San Francisco / Segoe UI stack for legibility.
- Titles: Iowan Old Style / Baskerville / Georgia, used sparingly, editorial not pseudo-medieval.
- Title scale: 34 px mobile, 42 px desktop.
- Body: 13 px task labels, 11 px context, 15 px section headers.
- Tab labels: 10 px, with SVG line icons and real descriptions.

### Layout and rhythm
- Spacing: 4 / 8 / 12 / 16 / 22 / 30 / 40 px; no ad hoc margin override piles.
- Tap targets >= 48 px for primary input controls.
- Small radius 9; control 12; emphasized surface 16.
- One emphasized task surface on home. Remaining sections use calm rows separated by 1 px hairlines.
- Navigation always exactly four: **Today**, **Calendar**, **Work**, **Money**.
- Mobile navigation is edge-attached, not floating; content reserves space and the iOS home indicator safe area.
- Mastery lives under Work > Practice, with evidence-based practice history rather than fake XP percentages.

### Information architecture / first-run question answered
1. **What do I do next?** Today > first priority > Open steps > Mark complete.
2. **When?** Today > Schedule > Calendar, or Add > Calendar block.
3. **What else is on my plate?** Work > Projects / All tasks.
4. **How am I progressing?** Today > completed counts; Work > project completion percentages; Work > Practice > actual minutes.
5. **Where do I input money?** Money > Record expense / income / balance; no ghost bank sync.
6. **How do I add anything?** Always one visible `+` in the header; actionable choices with plain-language labels.

### Interaction contract
- Every visible control must act. Nothing is a decorative pretend button.
- All `aria-*` labels and role states are dynamic when tasks are checked.
- One visible primary button per context.
- Empty state explains what can be done next.
- Color alone never indicates status; labels and count remain readable.
- No motivational filler, no AI coach jargon or phantom metrics.
- Remember all preview records in an isolated browser-local key. No real Google Calendar connection in the preview.

### Movement
- Hover and focus feedback <220 ms. User preferences for reduced motion respected.
- No repeating pulses, simulated loading, or animation used as decoration.

### Production acceptance checks (required before replacing current app)
- iPhone 390x844 screenshot (includes scroll to bottom); 320x568 narrow screen; tablet/desktop.
- Top action is apparent in <3 seconds to a first-time user.
- Record the $68 gym expense without hunting through pages.
- Complete and restore a task; reload and verify persisted state.
- Add an event; move between days; verify the date.
- Tab Work > Practice and record a real session; verify minutes appear.
- Test keyboard operation, field validation, safe areas, and no horizontal overflow.
- Audit contrast and ensure personal data cannot be exposed publicly.