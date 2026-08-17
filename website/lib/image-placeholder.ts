/**
 * Loading placeholders for `next/image`.
 *
 * `next/image` paints whatever `placeholder` holds as the `<img>`'s own
 * background and drops it the moment the real file decodes, so a placeholder
 * costs no wrapper element, no client component and no state of our own — it
 * is a string prop that works from a server component.
 *
 * Photographs get a real blur-up: import the file (`import friends from
 * "@/public/..."`) and pass `placeholder="blur"`, and the build derives the
 * blurred thumbnail from the source. That only works for raster formats Next
 * can decode, and most of our artwork is SVG, so those get a shimmer instead.
 */

/**
 * A flat panel with a highlight sweeping across it.
 *
 * Colours are literals rather than palette tokens because an SVG used as a
 * background cannot see the page's CSS variables — hence the two exports
 * below, one tuned for light surfaces and one for the dark cards.
 *
 * For the same reason the sweep cannot switch itself off for
 * `prefers-reduced-motion`: the browser renders a background SVG in its own
 * context, which never reports the visitor's preference. `globals.css` drops
 * the whole image and leaves a flat panel instead — see the rule matching
 * `img[style*="sweep"]`, which is why that class name has to stay put.
 */
function shimmer({
  panel,
  sweep,
}: {
  /** Opacity of the grey panel, over whatever surface sits behind the image. */
  panel: number;
  /** Peak opacity of the white highlight travelling across the panel. */
  sweep: number;
}): `data:image/${string}` {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" preserveAspectRatio="none">
      <style>
        .sweep { animation: sweep 1.6s ease-in-out infinite }
        @keyframes sweep {
          from { transform: translateX(-120px) }
          to { transform: translateX(120px) }
        }
      </style>
      <defs>
        <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0"/>
          <stop offset="0.5" stop-color="#fff" stop-opacity="${sweep}"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="#808080" fill-opacity="${panel}"/>
      <rect class="sweep" width="120" height="120" fill="url(#s)"/>
    </svg>`;

  // The markup is inlined into the HTML once per image, so ship it collapsed.
  const minified = svg.trim().replace(/\s+/g, " ").replace(/> </g, "><");

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(minified)}`;
}

/**
 * The default skeleton, for artwork sitting on the page's light surfaces.
 *
 * Pass it straight to the `placeholder` prop:
 *
 * ```tsx
 * <Image src="/clips/calculator.svg" alt="…" placeholder={SHIMMER} … />
 * ```
 *
 * Skip it for anything under 40×40 — Next warns that the placeholder costs
 * more than the icon it covers, and it would be gone before the eye caught it.
 */
export const SHIMMER = shimmer({ panel: 0.16, sweep: 0.45 });

/**
 * The same skeleton for artwork on the near-black cards, where a white
 * highlight at full strength reads as a flash rather than a shimmer.
 */
export const SHIMMER_DARK = shimmer({ panel: 0.1, sweep: 0.14 });
