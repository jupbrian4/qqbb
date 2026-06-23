# Private Postcard Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local static prototype for a gentle private postcard diary with a scrapbook hero, flippable postcards, image upload, Lucky mode, and a past-date collage collection.

**Architecture:** The prototype is a static HTML/CSS/JavaScript app. Pure state helpers live in `src/state.js` and are covered by Node tests. DOM behavior lives in `src/app.js`, while visual treatment lives in `styles.css`.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript modules, Node built-in test runner. GSAP can be loaded by CDN for static-page animation, with CSS/Web Animations fallbacks.

---

### Task 1: State Helpers

**Files:**
- Create: `work/qqbb-postcard-diary/src/state.js`
- Create: `work/qqbb-postcard-diary/test/state.test.js`

- [ ] **Step 1: Write failing tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  flipPostcard,
  activateLucky,
  selectLuckyElement,
  addUploadedImage,
  buildPastCollectionCards,
} from "../src/state.js";

test("flipPostcard toggles only the selected postcard", () => {
  const state = createInitialState();
  const next = flipPostcard(state, "a");
  assert.equal(next.postcards.a.flipped, true);
  assert.equal(next.postcards.b.flipped, false);
});

test("Lucky mode selects replaceable elements only", () => {
  const state = activateLucky(createInitialState());
  const next = selectLuckyElement(state, "upload-slot");
  assert.equal(next.lucky.active, true);
  assert.equal(next.lucky.selectedElementId, "upload-slot");
  assert.throws(() => selectLuckyElement(state, "date"));
});

test("addUploadedImage creates a treated scrapbook element", () => {
  const state = createInitialState();
  const next = addUploadedImage(state, { name: "window.jpg", url: "blob:window" });
  const uploaded = next.elements.find((element) => element.source === "upload");
  assert.equal(uploaded.type, "photo");
  assert.equal(uploaded.replaceable, true);
  assert.equal(uploaded.treatment.includes("desaturated"), true);
});

test("buildPastCollectionCards hides index data and returns dated collage cards", () => {
  const cards = buildPastCollectionCards(createInitialState().pastEntries);
  assert.equal(cards[0].kind, "date-collage");
  assert.equal(cards[0].dateIndexHidden, true);
  assert.equal(cards.every((card) => card.sources.length >= 2), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test work/qqbb-postcard-diary/test/state.test.js`

Expected: fail because `src/state.js` does not exist yet.

- [ ] **Step 3: Implement minimal helpers**

Create `src/state.js` with immutable state helpers matching the test API.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test work/qqbb-postcard-diary/test/state.test.js`

Expected: all tests pass.

### Task 2: Static Prototype

**Files:**
- Create: `work/qqbb-postcard-diary/index.html`
- Create: `work/qqbb-postcard-diary/styles.css`
- Create: `work/qqbb-postcard-diary/src/app.js`

- [ ] Build the scrapbook hero with today's date, two flippable postcards, the `+` upload control, Lucky mode, and the quiet past entry.
- [ ] Build the past collection as dated collage cards, without exposing a date index.
- [ ] Use MingLiU or PMingLiU in the writing areas with fallback typography.
- [ ] Keep all controls keyboard-accessible.
- [ ] Provide reduced-motion behavior.

### Task 3: Verification

**Files:**
- Verify: `work/qqbb-postcard-diary/index.html`
- Verify: `work/qqbb-postcard-diary/styles.css`
- Verify: `work/qqbb-postcard-diary/src/app.js`

- [ ] Run state tests.
- [ ] Run a static scan for banned placeholder words and em-dashes.
- [ ] Open the prototype locally and inspect desktop/mobile layout.

