# List-item hover effects

A small demo project showing three CSS-only hover treatments for a row-list — `scan`, `brackets`, and `spotlight` — applied side-by-side so they can be compared at a glance.

The whole demo lives in **[`app/components/hover-list.tsx`](./app/components/hover-list.tsx)** — one file, top-to-bottom, from row data to the three hover variants. The reveal-on-scroll wrapper lives in [`app/components/reveal.tsx`](./app/components/reveal.tsx).

## Demo

<video src="./assets/demo.mov" controls muted playsinline></video>

## The three hover variants

Each is a separate sub-component inside `hover-list.tsx`:

| Variant | What it does |
| --- | --- |
| `ScanAccents` | A wash with a bright leading edge sweeps left→right across the row; two hairline tracers extend along the top and bottom edges in sync. Reads as "now reading this row". |
| `BracketAccents` | Four corner brackets fan outward at rest, then snap inward on hover (with a back-easing overshoot) to frame the row content. The number + body shift inward at the same time, so the brackets read as a new frame the content has retreated inside. |
| `SpotlightAccents` | A soft radial glow follows the cursor across the row via `--mx`/`--my` custom properties written by an `onMouseMove` handler. Two faint hairlines fade in to bound the row so the spotlight reads as a state, not ambient haze. |

## Run it

```bash
bun install
bun dev
```

Open http://localhost:3000.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
