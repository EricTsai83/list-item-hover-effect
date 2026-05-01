"use client";

import { useEffect, useState, type MouseEvent } from "react";

import { Reveal } from "./reveal";

// ─── Data + types ─────────────────────────────────────────────────────
//
// Inlined here so the demo is self-contained — one file shows the whole
// picture (rows + the three hover variants).

type Entry = {
  num: string;
  lead: string;
  trail: string;
};

const ENTRIES: ReadonlyArray<Entry> = [
  {
    num: "01",
    lead: "Drop in a public GitHub URL.",
    trail: "We clone it into an isolated sandbox.",
  },
  {
    num: "02",
    lead: "The codebase gets mapped.",
    trail: "Files indexed, README parsed, ADRs surfaced.",
  },
  {
    num: "03",
    lead: "Every answer cites a real file.",
    trail: "No hallucinated guesses — open the source and verify.",
  },
];

const HEADING_ID = "hover-list-heading";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

// ─── Row variants ─────────────────────────────────────────────────────

const ROW_STAGGER_MS = 80;

const ROW_VARIANTS = ["scan", "brackets", "spotlight"] as const;
type RowVariant = (typeof ROW_VARIANTS)[number];

const ROW_BASE_CLASS =
  "group/row relative isolate ml-2 grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-t border-border/60 py-6 pl-2 last:border-b sm:ml-4 sm:gap-x-10 sm:py-7 sm:pl-4";

/**
 * A list of three rows where each row showcases a different
 * CSS-only hover effect — `scan`, `brackets`, and `spotlight`.
 *
 * Hover any row to see its variant play. To use a single variant in
 * production, drop the `variant` prop and the two unused accent
 * components, keeping only the chosen accent inlined into
 * `<HoverRow />`.
 */
export function HoverList() {
  return (
    <Reveal>
      <section
        aria-labelledby={HEADING_ID}
        className="relative flex flex-col gap-12 sm:gap-16"
      >
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <h2
              id={HEADING_ID}
              className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              Three list-item hover effects
            </h2>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
              scan → brackets → spotlight
            </p>
          </div>

          <ThemeToggle />
        </header>

        <ol className="flex flex-col gap-0">
          {ENTRIES.map((item, idx) => (
            <HoverRow
              key={item.num}
              item={item}
              index={idx}
              variant={ROW_VARIANTS[idx % ROW_VARIANTS.length]}
            />
          ))}
        </ol>
      </section>
    </Reveal>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DARK_MODE_QUERY);
    const syncTheme = () => {
      const theme = document.documentElement.dataset.theme;
      setIsDark(theme === "dark" || (theme !== "light" && media.matches));
    };

    syncTheme();
    media.addEventListener("change", syncTheme);

    return () => media.removeEventListener("change", syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="group/toggle inline-flex w-fit items-center gap-3 self-start rounded-full border border-border/70 bg-muted/35 px-3 py-2 transition-colors duration-200 hover:border-primary/50 hover:bg-muted/55"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Dark Mode
      </span>
      <span
        aria-hidden
        className="relative h-3 w-9 rounded-full border border-border bg-background transition-colors duration-200 group-aria-pressed/toggle:border-primary/70 group-aria-pressed/toggle:bg-primary/20"
      >
        <span className="absolute left-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-muted-foreground transition-all duration-200 group-aria-pressed/toggle:translate-x-6 group-aria-pressed/toggle:bg-primary" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
        {isDark ? "On" : "Off"}
      </span>
    </button>
  );
}

function HoverRow({
  item,
  index,
  variant,
}: {
  item: Entry;
  index: number;
  variant: RowVariant;
}) {
  return (
    <li
      className={ROW_BASE_CLASS}
      style={{ animationDelay: `${index * ROW_STAGGER_MS}ms` }}
      onMouseMove={variant === "spotlight" ? trackPointer : undefined}
    >
      {variant === "scan" && <ScanAccents />}
      {variant === "brackets" && <BracketAccents />}
      {variant === "spotlight" && <SpotlightAccents />}

      <NumberCell num={item.num} variant={variant} />

      <div
        className={`flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6${
          variant === "brackets"
            ? " transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:-translate-x-1.5 group-hover/row:duration-300"
            : ""
        }`}
      >
        <p className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
          {item.lead}
        </p>
        <p className="text-pretty text-[14px] leading-relaxed text-muted-foreground sm:flex-1 sm:text-[15px]">
          {item.trail}
        </p>
      </div>
    </li>
  );
}

/**
 * Pointer tracker for the `spotlight` variant. Stores the cursor's
 * row-relative position on the row element as `--mx`/`--my` CSS custom
 * properties; the radial-gradient layer reads them. Defined at module
 * scope so the listener has a stable identity across renders.
 */
function trackPointer(e: MouseEvent<HTMLLIElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/**
 * The step number cell. Color-shifts to primary on hover across all
 * variants; each variant adds its own flourish on top:
 *   - scan      → no extra flourish (the wash is the star).
 *   - brackets  → translates inward (rightward) — paired with the body
 *                 translating inward (leftward), this reads as a ring
 *                 of padding suddenly appearing the moment the brackets
 *                 lock on. Digits keep their size; only their position
 *                 shifts. (Avoid `tracking` and `scale` here: tracking
 *                 only adds gap *after* each glyph so the "0" wouldn't
 *                 move, and scale reads as the digits getting smaller
 *                 rather than the row gaining an inset.)
 *   - spotlight → a soft glow text-shadow turns up under the spotlight.
 */
function NumberCell({ num, variant }: { num: string; variant: RowVariant }) {
  const base =
    "font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground/90 transition-all duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:text-primary group-hover/row:duration-300 sm:text-lg";

  if (variant === "brackets") {
    return (
      <span className={`${base} inline-block group-hover/row:translate-x-1.5`}>
        {num}
      </span>
    );
  }
  if (variant === "spotlight") {
    return (
      <span
        className={`${base} [text-shadow:0_0_0_transparent] group-hover/row:[text-shadow:0_0_14px_rgba(56,189,248,0.55)]`}
      >
        {num}
      </span>
    );
  }
  return <span className={base}>{num}</span>;
}

/**
 * Variant A — "Index scan".
 *
 * A wash with a bright leading edge sweeps left → right across the row,
 * like a scan head reading the line. The brightness is baked into the
 * gradient itself (faint at 0%, brightest at 100%), so as the wash
 * scales-x from origin-left, the bright tip travels rightward.
 *
 * Two hairline tracers (top + bottom edges) extend with the same
 * timing, giving the active row a "now reading" frame. The whole thing
 * reads as one continuous sweep with a clear start (left), end (right),
 * and direction.
 */
function ScanAccents() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:scale-x-100 group-hover/row:duration-[700ms]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(56,189,248,0.02) 0%, rgba(56,189,248,0.06) 60%, rgba(56,189,248,0.28) 94%, rgba(56,189,248,0.55) 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 right-0 h-px origin-left scale-x-0 bg-linear-to-r from-primary/10 via-primary/55 to-primary transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:scale-x-100 group-hover/row:duration-[700ms]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 bg-linear-to-r from-primary/10 via-primary/55 to-primary transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/row:scale-x-100 group-hover/row:duration-[700ms]"
      />
    </>
  );
}

/**
 * Variant B — "Bracket lock-on".
 *
 * Four corner brackets — each an L-shape made from two borders — sit
 * fanned outward while idle. On hover they snap inward (with a slight
 * back-easing overshoot) to frame the row content, like an IDE selection
 * or a viewfinder reticle clicking into place.
 *
 * A faint elliptical wash backs them up, softening what would otherwise
 * be a four-corners-only hit. The row's content (number + body) shifts
 * inward by an equal amount on each side at the same time, as if a ring
 * of padding suddenly appeared the moment the brackets clicked into
 * place — the brackets are the new frame, and the content has retreated
 * inside it. Digit size doesn't change; only the position does.
 */
function BracketAccents() {
  const corner =
    "pointer-events-none absolute h-3 w-3 border-primary/85 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/row:opacity-100 [filter:drop-shadow(0_0_4px_rgba(56,189,248,0.45))]";
  return (
    <>
      <span
        aria-hidden
        className={`${corner} top-1.5 left-1.5 border-t-2 border-l-2 -translate-x-1.5 -translate-y-1.5 group-hover/row:translate-x-0 group-hover/row:translate-y-0`}
      />
      <span
        aria-hidden
        className={`${corner} top-1.5 right-1.5 border-t-2 border-r-2 translate-x-1.5 -translate-y-1.5 group-hover/row:translate-x-0 group-hover/row:translate-y-0`}
      />
      <span
        aria-hidden
        className={`${corner} bottom-1.5 left-1.5 border-b-2 border-l-2 -translate-x-1.5 translate-y-1.5 group-hover/row:translate-x-0 group-hover/row:translate-y-0`}
      />
      <span
        aria-hidden
        className={`${corner} bottom-1.5 right-1.5 border-b-2 border-r-2 translate-x-1.5 translate-y-1.5 group-hover/row:translate-x-0 group-hover/row:translate-y-0`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-out group-hover/row:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at center, rgba(56,189,248,0.07) 0%, rgba(56,189,248,0.02) 60%, transparent 100%)",
        }}
      />
    </>
  );
}

/**
 * Variant C — "Pointer-tracked spotlight".
 *
 * A soft radial glow follows the cursor across the row. The cursor's
 * row-relative position is written to `--mx`/`--my` by `trackPointer`
 * (HoverRow's onMouseMove); the gradient reads them so the highlight
 * feels physically attached to the pointer.
 *
 * Two hairline edges fade in to give the row a clear bounding region —
 * without them the spotlight alone reads as ambient haze rather than
 * a state.
 */
function SpotlightAccents() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 ease-out group-hover/row:opacity-100 group-hover/row:duration-300"
        style={{
          background:
            "radial-gradient(circle 14rem at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.22), rgba(56,189,248,0.06) 35%, transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover/row:opacity-100 group-hover/row:duration-300"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover/row:opacity-100 group-hover/row:duration-300"
      />
    </>
  );
}
