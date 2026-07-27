# Ed's Auto Glass — redesign concept

A proposed redesign of the home page for [Ed's Auto Glass](https://www.edsautoglassrepair.com/),
a family-run auto glass shop at 861 Falling Creek Rd, Spartanburg, SC.

Static HTML/CSS/JS, no build step and no dependencies. Open `index.html` in a browser.

```
redesign/
├── index.html                        home page
├── service-area/boiling-springs.html one town page, built as the template
└── assets/
    ├── styles.css                    tokens + components, light and dark
    └── app.js                        hours badge, estimator, hero star break
```

## What the page is built around

A local auto glass site has one job: turn someone standing next to a cracked
windshield into a phone call, in under a minute, on a phone screen. Everything
here follows from that.

- **The phone number is the interface**, not a footer line — header, hero,
  estimator, contact block, and a fixed call bar on mobile.
- **A live open/closed badge** computed in the shop's own timezone, so a
  customer calling at 8pm sees "Closed · opens 9am" instead of wasting the call.
- **A repair-or-replace estimator**, the question people actually phone about.
  Three questions — damage size, position on the glass, number of chips — and a
  verdict that explains itself. Any one disqualifier (edge damage, over six
  inches, three or more chips, or a sizeable chip in the driver's view) means
  replacement.
- **ADAS calibration is given real estate.** It's the genuine differentiator:
  most small shops send the customer on to a dealer for a second appointment.
- **Straight FAQ answers** on cure time, safe drive-away time, and insurance —
  the things a worried customer searches at 11pm.

## Design

The palette comes from the material rather than from the usual red-and-black
auto-service template:

| Token      | Light     | Dark      | Where it comes from                                  |
|------------|-----------|-----------|------------------------------------------------------|
| `--edge`   | `#0E8E7A` | `#17B39A` | the green tint on the cut edge of laminated glass     |
| `--signal` | `#E24A08` | `#FF6A2B` | roadside safety orange — call button only, nothing else |
| `--frit`   | `#0C1315` | `#05090A` | the black ceramic dot band printed around every windshield |
| `--ground` | `#F4F6F5` | `#0A1012` | neutrals biased green-cyan, not plain grey            |

The frit dot-matrix appears for real: as the section dividers and as the border
treatment on the hero panel, with the dot size falling off across the band the
way it does on actual glass. The hero panel is clipped to a windshield's
trapezoid taper, and a chip star-break is drawn on canvas over it — once, on
load, and held static under `prefers-reduced-motion`.

Type is a condensed grotesque in caps for display, the system sans for reading,
and monospace for shop data (phone, hours, durations, town lists). No webfonts
are loaded, so there's no risk of a silent fallback.

Both themes are defined at token level: `prefers-color-scheme` for the OS
preference, plus `:root[data-theme="…"]` overrides.

## SEO

- `AutoRepair` (LocalBusiness) JSON-LD on the home page with address, phone,
  opening hours, service catalog, and the served towns.
- `FAQPage` JSON-LD matching the visible FAQ verbatim. Note that Google has
  narrowed FAQ rich results to authoritative sites — the markup is still correct
  and worth having, but don't expect the expanded snippet.
- Town pages carry `Service` + `BreadcrumbList` and are written from what is
  actually different about serving that town. Duplicating one paragraph across
  twelve towns with the name swapped is worse than having no town pages at all.
- Canonical, description, and Open Graph tags are set per page.

## Before this could go live

- **Photography.** Real pictures of Ed, the bay, and the mobile van, replacing
  the geometric hero. This matters more than any other item here.
- **Live Google reviews** in place of the three marked-up placeholders. The
  quotes currently in the file paraphrase the sentiment of real reviews and are
  not attributed to real people — they must not ship as-is.
- **Facts only the shop has**: year founded, warranty terms, whether OEM glass
  is stocked, real mobile-area boundaries, and whether a trip charge exists.
  Nothing in this concept invents a number the business hasn't stated.
- **The remaining eleven town pages**, following the Boiling Springs template.
- Analytics, and call tracking if the shop wants to measure which page earns
  the phone call.
