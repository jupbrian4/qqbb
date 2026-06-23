# Product

## Register

product

## Users

Two people in a private relationship use this once a day to ask and answer one question. They usually open it in a quiet personal context, often on a phone or laptop, and the primary task is not productivity. The task is to pause, write honestly, see the other person's answer, and keep a dated trace.

## Product Purpose

This product is a private daily postcard diary. Each date has one shared question, two postcard answers, optional date-level conversation, and a scrapbook hero surface that can be refreshed without breaking the visual language.

Success means:

- The daily question and two answers are easy to write and revisit.
- The page feels personal, soft, and tactile without becoming childish or cluttered.
- Postcard fronts, paper scraps, photo fragments, labels, stamps, and small text pieces can be replaced later while preserving one consistent style.
- Past dates remain accessible without turning the hero into a dashboard.

## Primary Experience

The first screen is the daily scrapbook hero. It contains:

- Today's date as a visual object in the composition.
- Two flippable postcards, one for each person.
- A quiet entry to past dates.
- A small upload entry for adding personal images into the current collage.
- An "I'm feeling lucky" mode for replacing scrapbook elements and postcard fronts.

The two postcards default to their landscape side. Clicking a postcard flips it to its writing side. The writing side contains fields for:

- Today I want to ask you:
- My answer:

The postcard front is also a replaceable scrapbook element. Lucky mode can target it in the same way it targets paper scraps, photo fragments, labels, stamps, and text pieces.

The past-date entry remains visible in the hero as a short phrase such as "View past". The date index itself is hidden in the first version. It is not removed from the product model.

## Core Flows

### Daily Answer

1. Open today's page.
2. See the scrapbook composition and both landscape postcards.
3. Flip a postcard.
4. Write or edit the question and answer fields.
5. Save automatically or through a quiet explicit save state.
6. Return to the landscape side or keep the writing side visible.

### Review Past Dates

1. Use the quiet past-date entry in the hero.
2. Open a postcard collection view.
3. Browse date collage cards, where one collage card represents one date.
4. Select a date collage to review that day's question, both answers, and conversation.

### Upload A Personal Image

1. Click the small plus icon in the hero.
2. Choose an image.
3. The image is processed into the visual system through crop, desaturation, paper edge, grain, and rotation rules.
4. The processed image appears as part of the current day's collage.

### Replace A Scrapbook Element

1. Click "I'm feeling lucky".
2. The replaceable elements become selectable.
3. Select one element.
4. Enter a search phrase.
5. Generate or fetch a new candidate.
6. Retry until it fits.
7. Accept the replacement.

## Content Model

### Date Entry

- Date
- Shared question
- Person A answer
- Person B answer
- Date-level messages
- Scrapbook composition state
- Uploaded images
- Generated date collage card

### Scrapbook Element

- Type: postcard-front, photo, paper, tape, stamp, label, text-fragment, doodle, small-object
- Source: user-provided, generated, searched, or default placeholder
- Style treatment: crop, rotation, scale, texture, color treatment, shadow, paper edge
- Lock state: fixed functional element or replaceable decoration

### Date Collage Card

- Date
- Source postcard fronts from that date
- Optional postcard-back fragment from that date
- Composition type: taped pair, torn-edge join, irregular grid, or front-back mix
- Style treatment
- Link to the date entry

### Postcard

- Owner
- Front image
- Back layout
- Question text
- Answer text
- Saved state
- Flip state

## Privacy Boundary

The product is private by default. Only the two allowed accounts should be able to access entries, images, answers, messages, and scrapbook state. No public sharing is part of the first version.

## Strategic Principles

1. Keep the daily ritual gentle. The interface should slow the moment down without making the user work.
2. Treat every replaceable asset as part of one house style. Replacement is not random decoration.
3. Keep function and decoration separate. Dates, postcards, history, and Lucky mode must remain legible and reachable.
4. Let memory feel physical. Paper, ink, stamps, photo grain, and layered depth should carry the mood.
5. Make the past feel browsable, not searchable first. The first past view is a collection of dated collage cards, while the date index stays hidden until needed.
6. Avoid template romance. No heart-heavy UI, no generic couple app visual language, no sentimental filler copy.

## Accessibility & Inclusion

- Body text, input text, and controls must meet WCAG AA contrast.
- The flip interaction must work by keyboard and touch, not hover only.
- Reduced motion must disable flip flourish, drift, and replacement animation while keeping state changes understandable.
- Input labels must be real labels, not placeholders.
- The scrapbook composition must not trap focus or hide functional controls behind decoration.
