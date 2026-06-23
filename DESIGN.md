# Design

## Design Read

Reading this as a private daily product surface for two people, with a lo-fi scrapbook archive language, leaning toward tactile paper composition, flippable postcards, and restrained state-driven motion.

## Direction

The visual anchor is Lo-Fi. The page should feel like a carefully kept scrapbook page found inside a box of postcards: paper-yellow surface, mixed system typography, slightly rotated layers, printed labels, soft photo grain, tape, stamps, old card edges, and risograph-like misregistration.

The differentiator is a replaceable scrapbook stage. The hero is not a static decorative collage. Every decorative layer has a typed role, and Lucky mode can replace it while preserving crop, texture, rotation, and color treatment.

## Style Anchor

Selected anchor: Lo-Fi.

Required tokens from the anchor:

- Surface: `#E8E0C0` or `#EDE4CF`.
- Typography: mixed system fonts, especially Times, Helvetica, and Courier.
- Structure: rotated elements, 2-8 degrees off-grid.
- Texture: halftone dots, paper grain, risograph-like channel offsets, tape, staples, torn edges.

This project should not drift into Swiss minimalism, Organic wellness, or generic cream romance. The page can be soft, but it should still have collage tension.

## Mood

Softness should come from pacing, material, and restraint, not from pastel sweetness.

Use:

- Faded landscape photography.
- Aged paper with visible fibers.
- Quiet blue, postal red, washed olive, ink black, and warm paper.
- Small handwriting moments.
- Slow flip and replacement transitions.
- Enough empty paper around the functional postcards so the user can breathe.

Avoid:

- Heart icons as a visual system.
- Sticker overload.
- Cute microcopy.
- Dense Pinterest-style collage.
- Random English words that do not carry product meaning.
- Heavy shadows, glass panels, neon, or gradient text.

## Palette

Use the Lo-Fi anchor colors as CSS source tokens.

```css
:root {
  --paper: #E8E0C0;
  --paper-lifted: #EDE4CF;
  --ink: #1F1A16;
  --ink-soft: #4E463D;
  --postal-red: #B91F1B;
  --postal-blue: #276A8F;
  --washed-olive: #6C754D;
  --tape: #B98F52;
  --shadow: rgba(31, 26, 22, 0.22);
}
```

Primary accent: postal red. Use it for one or two meaningful moments: date stamp, active Lucky selection, or postcard stamp detail. Do not use red as generic decoration everywhere.

Secondary accent: postal blue. Use it for postcard lines, stamp marks, and quiet navigation.

## Typography

Use system fonts only to preserve the Lo-Fi anchor.

- Date: Helvetica or Arial Black, large, slightly condensed by layout rather than letter-spacing tricks.
- Postcard labels: Courier New or system monospace.
- Body writing: a handwriting-style font can be added later only if it is high quality and readable. Until then, use Times New Roman italic sparingly for written content and Courier New for structural postcard text.
- UI controls: Helvetica or system-ui, plain and readable.
- Writing area experiment: try MingLiU or PMingLiU for handwritten-answer areas only. If contrast, rhythm, or mobile readability suffers, fall back to Times New Roman italic.

No display font should appear in inputs, labels, or controls. The expressive type belongs to the date, labels, and printed scraps.

## Hero Composition

The hero is a full-viewport scrapbook surface using `min-height: 100dvh`.

Functional elements:

- Date object: top-left or upper-middle, integrated as a stamp or large printed date.
- Two postcards: dominant central objects, layered but not hidden.
- Past-date entry: small tab, ticket, or stamp near an edge.
- Plus icon: a small upload affordance for adding personal images into the current collage.
- "I'm feeling lucky": small tool-like control that activates replacement mode.

Decorative elements:

- Two placeholder postcard-front landscape slots.
- 4-7 paper/photo/stamp/tape elements.
- 1-2 text-fragment elements at most.

Composition rule: decoration may overlap decoration, but never obscure active postcard text, the date, the past-date entry, or Lucky controls.

The past-date entry stays visible in the hero. The date index is hidden in the first version. The past view opens directly into a postcard collection.

## Placeholder Postcard Fronts

First prototype uses two placeholder front images:

1. `postcard-front-a`: faded mountain or coastal landscape, cool and slightly overexposed.
2. `postcard-front-b`: quiet urban or train-window landscape, muted and film-like.

Both are replaceable elements. They should use the same treatment:

- 3:2 or 4:3 crop inside a postcard border.
- Slight desaturation.
- Paper border with aged edge.
- Light grain.
- Optional tiny date imprint, but no fake location unless provided by the user.

## Postcard Back

The back side follows a traditional postcard layout:

- Top label: `POSTCARD`.
- Left writing area: question and answer fields.
- Right address-like area: optional saved metadata or empty decorative postal lines.
- Stamp area: small replaceable stamp element.
- Center divider line.

Visible labels:

- Today I want to ask you:
- My answer:

Labels should stay plain. Do not replace standard UI copy with themed language.

## Lucky Mode

Lucky mode changes the surface from viewing to replacing.

Default state:

- Scrapbook elements are passive.
- Postcards flip on click.
- Past-date entry remains quiet.

Lucky active state:

- Replaceable elements receive a subtle outline or tape-corner highlight.
- Functional controls stay active but visually lower than the selected element.
- Selecting an element opens an inline search box close to the selected element.
- Search results should preserve element type unless the user chooses otherwise.

Replacement style processing:

- Crop into the existing element frame.
- Match the current element's rotation and size.
- Apply the project's paper/photo treatment.
- Limit saturation.
- Add subtle grain or halftone only after readability is preserved.

Retry behavior:

- Retry replaces the candidate in place.
- Accept commits the candidate.
- Cancel restores the previous element.

## Upload Mode

The hero includes a small plus icon. Either person can upload a preferred image into the current day's collage.

Upload treatment:

- Crop to a useful fragment rather than showing the full image by default.
- Desaturate slightly.
- Add paper edge or white torn border.
- Add light grain.
- Rotate 1-5 degrees.
- Place behind or beside the postcards unless explicitly selected.
- Store the original source separately from the treated visual layer.

The upload affordance should feel like a small tool on the scrapbook surface, not a primary call-to-action.

## Past Collection

The past view shows a collection of dated collage cards. One collage card represents one date.

Card composition should be generated from that date's uploaded postcard-front images and optional postcard-back fragments. Use one of these composition families:

- Taped pair: two postcard fronts lightly overlapped and held by tape.
- Torn-edge join: two image fragments meet through a white torn edge.
- Irregular grid: 6-10 postcard image fragments arranged in a controlled grid, inspired by the collage reference with blue sky and black shapes.
- Front-back mix: one landscape side paired with a partial writing-side fragment.

Design preference:

- Use taped pair or torn-edge join for the first prototype because they keep the date readable and feel more intimate.
- Use irregular grid only when the date has enough strong image material.
- Do not use random collage density for every date. Each card should still feel like one object.
- Each card may show the date as a small printed mark, not a large label.

## Motion

Motion intensity: 5 out of 10.

Use GSAP only where it earns its weight:

- Postcard flip: state transition.
- Lucky mode element selection: feedback.
- Replacement candidate arrival: state transition.
- Optional small paper settling motion after replacement.

Prefer CSS or Motion for simpler hover and focus states. Do not use GSAP for scroll choreography in the first version.

Motion rules:

- Flip duration: 450-650 ms.
- Replacement settle: 250-400 ms.
- Upload image arrival: 250-400 ms.
- Past collection card hover: 150-220 ms.
- Easing: soft ease-out, no bounce, no elastic.
- Animate transform and opacity only.
- Reduced motion: instant flip with a short crossfade.
- Cleanup required for any framework animation lifecycle.

## Interaction States

Postcard:

- Default: landscape side.
- Hover or focus: small lift, no aggressive tilt.
- Active: flip starts.
- Editing: back side remains stable.
- Saved: quiet saved indication, not a toast-heavy flow.
- Error: inline near the relevant field.

Lucky element:

- Passive: no visible UI chrome.
- Lucky active: selectable outline.
- Selected: stronger outline and inline search field.
- Loading: local skeleton or paper placeholder in the same shape.
- Error: plain retry message.

Past dates:

- Quiet tab or label.
- Opens a postcard collection view.
- The date index is hidden in the first version.

## Responsive Behavior

Desktop:

- Two postcards can sit side by side or overlap lightly.
- Scrapbook elements can create asymmetry around them.

Tablet:

- Postcards stay central.
- Decorative elements reduce count and move away from input areas.

Mobile:

- One postcard visible at a time with a clear switch between the two people.
- Date remains visible.
- Lucky mode can still select elements, but the search box should become a bottom sheet or anchored panel.
- Upload should open the native file picker and place the new image into a predictable area.
- No text may overflow the postcard back.

## Asset System

Every visual element needs metadata:

- `id`
- `type`
- `role`
- `replaceable`
- `position`
- `rotation`
- `scale`
- `zIndex`
- `treatment`
- `source`

Functional elements should be locked by default. Decorative elements and postcard fronts are replaceable.

Uploaded images and generated date collage cards should use the same metadata shape so they can enter Lucky mode later without special handling.

## Implementation Notes

- Build the first prototype as a real component preview, not a fake screenshot.
- Use real image placeholders or generated assets for postcard fronts and paper pieces.
- Keep the layout tokenized so replacements inherit style.
- Do not rely on random absolute positioning without a saved composition model.
- Keep UI controls plain and accessible even when they are visually embedded in the scrapbook.

## Quality Checks

- Does the hero still work if all decorative elements are hidden?
- Can both postcards be flipped, edited, saved, and read on mobile?
- Does Lucky mode clearly show what can be replaced?
- Does the plus upload produce a treated image that matches the page?
- Does the past collection feel like dated postcard objects rather than a normal gallery?
- Does a replaced element inherit the same paper/photo treatment?
- Are labels plain and readable?
- Is the result soft without becoming cute, sentimental, or template-like?
