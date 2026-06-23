import test from "node:test";
import assert from "node:assert/strict";
import {
  collageAssets,
  collagePrimitiveTypes,
  createHeroComposition,
  getAllCollageAssets,
  selectThemePack,
} from "../src/collageSystem.js";

const baseSeed = {
  coupleId: "qqbb",
  questionId: "daily-question",
  date: "2026-06-22",
  themePrompt: "雪山",
};

test("collage asset manifest has local procedural assets with metadata", () => {
  const requiredCategories = [
    "vintagePhotos",
    "paperScraps",
    "tapeStrips",
    "stampLikeMarks",
    "botanicalOrDecorativeElements",
    "handwritingOrScribbleElements",
    "smallStickerIcons",
  ];

  assert.deepEqual(Object.keys(collageAssets), requiredCategories);

  const allAssets = getAllCollageAssets();
  assert.ok(allAssets.length >= 18);
  assert.equal(
    allAssets.every((asset) =>
      asset.id
      && asset.type
      && Number.isFinite(asset.width)
      && Number.isFinite(asset.height)
      && asset.width > 0
      && asset.height > 0
      && asset.renderKind
      && !String(asset.src || "").startsWith("http"),
    ),
    true,
  );
});

test("theme prompt maps to local procedural packs", () => {
  assert.equal(selectThemePack("雪山").id, "snow-mountain");
  assert.equal(selectThemePack("海边").id, "sea");
  assert.equal(selectThemePack("森林").id, "forest");
  assert.equal(selectThemePack("东京夜晚").id, "city-night");
  assert.equal(selectThemePack("first date").id, "dreamy-memory");
});

test("hero composition is deterministic by couple question date and prompt", () => {
  const first = createHeroComposition(baseSeed);
  const again = createHeroComposition(baseSeed);
  const differentDay = createHeroComposition({ ...baseSeed, date: "2026-06-23" });

  assert.deepEqual(first, again);
  assert.notDeepEqual(first, differentDay);
});

test("hero composition follows physical collage constraints", () => {
  const items = createHeroComposition(baseSeed);
  const irregularShapes = new Set(["photo-cutout", "torn-paper", "hand-cut", "deckled-edge", "stamp-edge", "paper-scrap"]);
  const tapeCount = items.filter((item) => item.type === "tape").length;
  const photoCount = items.filter((item) => item.type === "vintagePhoto").length;
  const irregularCount = items.filter((item) => irregularShapes.has(item.shapeVariant)).length;

  assert.ok(items.length >= 14);
  assert.ok(items.length <= 22);
  assert.ok(tapeCount >= 3);
  assert.ok(tapeCount <= 5);
  assert.ok(photoCount <= 3);
  assert.ok(irregularCount / items.length >= 0.4);
  assert.equal(items.every((item) =>
    item.id
    && item.assetId
    && collagePrimitiveTypes.includes(item.primitive)
    && item.shapeVariant
    && Number.isFinite(item.x)
    && Number.isFinite(item.y)
    && Number.isFinite(item.rotation)
    && Number.isFinite(item.scale)
    && Number.isFinite(item.zIndex)
    && Number.isFinite(item.opacity),
  ), true);
});

test("uploaded photos enter composition as retro photo cards without raw rectangles", () => {
  const items = createHeroComposition({
    ...baseSeed,
    uploadedPhotos: [{ id: "upload-1", name: "home-window.jpg", url: "blob:home-window" }],
  });
  const uploaded = items.find((item) => item.assetId === "upload-1");

  assert.equal(uploaded.type, "vintagePhoto");
  assert.equal(uploaded.primitive, "GeneratedVintagePhotoCard");
  assert.ok(["photo-cutout", "hand-cut", "deckled-edge"].includes(uploaded.shapeVariant));
  assert.equal(uploaded.src, "blob:home-window");
});
