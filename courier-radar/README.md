# Courier Radar — V1

Phone-first Uber Eats e-bike dispatch copilot. The objective is to reduce idle time and improve online $/hr without forcing manual order logging.

## V1
- Installable Safari PWA for Vercel.
- Separate breakfast (6–10:30), lunch, afternoon, dinner, and late (9 PM–1 AM) learning.
- Dynamic radius: 2.5 mi during fresh flow, 3.5 mi after 8 idle minutes, 4–5 mi escape mode after 15 idle minutes.
- Learns zones from every captured offer, not just completed orders.
- Parses payout, miles, ETA, merchant candidate, Shop & Pay, and item count from OCR text.
- Adds a shopping-time penalty before effective $/hr.
- Secure server-side Supabase persistence.

## AI strategy
Do not put an LLM in the hot path unless needed. Deterministic parsing and dispatch math are faster and auditable.

Useful AI layers:
1. Low-confidence OCR cleanup only when the parser confidence is weak.
2. Merchant/entity normalization.
3. Weekly pattern summaries and explanations.
4. Later: destination/dead-zone interpretation from messy cross-street text.

AI should never invent demand or replace measured observations.

## Deploy
1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Import this repo into Vercel and set **Root Directory** to `courier-radar`.
4. Add `CAPTURE_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `TARGET_DPH=35`.
5. Deploy.
6. Safari → Share → Add to Home Screen.
7. Paste the same capture token into the PWA once.

## iPhone Shortcut A: Radar Capture
- Take Screenshot.
- Extract Text from Image.
- Get Current Location.
- Get Contents of URL: POST `https://YOUR-DOMAIN/api/capture`.
- Header: `x-capture-token: YOUR_CAPTURE_TOKEN`.
- JSON: `text`, `lat`, `lng`, `source=uber_eats`.
- Optional notification with returned verdict and rate.
- Assign to Settings → Accessibility → Touch → Back Tap → Double Tap.

## iPhone Shortcut B: Radar Accepted
POST `{"state":"accepted"}` to `/api/action` using the same header. Assign to Triple Back Tap.

Normal flow: offer appears → double tap → read TAKE/SKIP → if accepted, triple tap.

## Important measurement principle
Logging only completed orders biases the dataset. Courier Radar stores *all observed offers* so it can estimate the actual opportunity stream you were seeing in each time/location cell.

## Next
- destination quality + deadhead estimator
- merchant pickup-delay model
- presence-time denominator for true offers/online-hour
- completion/end-of-shift reconciliation
- learned map cells with confidence
- low-confidence AI parser fallback
