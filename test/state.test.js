import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  flipPostcard,
  activateLucky,
  archivePostcard,
  selectLuckyElement,
  addUploadedImage,
  buildPastCollectionCards,
  createReplacementCandidate,
  toggleLucky,
} from "../src/state.js";

test("flipPostcard toggles only the selected postcard", () => {
  const state = createInitialState();
  const next = flipPostcard(state, "a");

  assert.equal(next.postcards.a.flipped, true);
  assert.equal(next.postcards.b.flipped, false);
});

test("Lucky mode selects replaceable elements only", () => {
  const state = activateLucky(createInitialState());
  const next = selectLuckyElement(state, "scene-a");

  assert.equal(next.lucky.active, true);
  assert.equal(next.lucky.selectedElementId, "scene-a");
  assert.throws(() => selectLuckyElement(state, "date"));
});

test("Lucky mode accepts generated procedural collage elements", () => {
  const state = activateLucky(createInitialState());
  const next = selectLuckyElement(state, "collage-1-photo-snow-ridge");

  assert.equal(next.lucky.active, true);
  assert.equal(next.lucky.selectedElementId, "collage-1-photo-snow-ridge");
});

test("toggleLucky turns replacement mode on and off", () => {
  const on = toggleLucky(createInitialState());
  const off = toggleLucky(on);

  assert.equal(on.lucky.active, true);
  assert.equal(off.lucky.active, false);
  assert.equal(off.lucky.selectedElementId, null);
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
  assert.equal(cards[0].presentation, "single-postcard-mosaic");
  assert.equal(cards[0].dateIndexHidden, true);
  assert.equal(cards.every((card) => card.sources.length >= 4), true);
});

test("archivePostcard stamps the card and adds today's collage entry", () => {
  const state = createInitialState();
  const next = archivePostcard(state, "a");

  assert.equal(next.postcards.a.archived, true);
  assert.equal(next.pastEntries[0].date, state.date);
  assert.equal(next.pastEntries[0].sources.includes("postcard-front-a"), true);
});

test("createReplacementCandidate maps search text to local procedural assets", () => {
  const mountain = createReplacementCandidate("山 蓝色 胶带", 0);
  const note = createReplacementCandidate("手写 纸", 1);

  assert.equal(Boolean(mountain.assetId), true);
  assert.equal(Boolean(note.assetId), true);
  assert.equal(String(mountain.src || "").startsWith("http"), false);
  assert.equal(String(note.src || "").startsWith("http"), false);
  assert.equal(Boolean(mountain.shapeVariant), true);
  assert.equal(Boolean(note.renderKind), true);
});
