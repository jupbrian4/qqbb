export const collagePrimitiveTypes = [
  "GeneratedPaperScrap",
  "GeneratedTape",
  "GeneratedPostmark",
  "GeneratedStampLikeElement",
  "GeneratedScribble",
  "GeneratedBotanicalOrEphemera",
  "GeneratedVintagePhotoCard",
];

const localOnly = { source: "procedural", src: "" };

export const collageAssets = {
  vintagePhotos: [
    {
      id: "photo-snow-ridge",
      type: "vintagePhoto",
      renderKind: "procedural-photo",
      primitive: "GeneratedVintagePhotoCard",
      width: 420,
      height: 260,
      theme: "snow-mountain",
      variant: "mountain",
      tags: ["雪山", "mountain", "snow", "blue"],
      ...localOnly,
    },
    {
      id: "photo-sea-horizon",
      type: "vintagePhoto",
      renderKind: "procedural-photo",
      primitive: "GeneratedVintagePhotoCard",
      width: 460,
      height: 250,
      theme: "sea",
      variant: "sea",
      tags: ["海边", "sea", "boat", "cyan"],
      ...localOnly,
    },
    {
      id: "photo-forest-window",
      type: "vintagePhoto",
      renderKind: "procedural-photo",
      primitive: "GeneratedVintagePhotoCard",
      width: 320,
      height: 410,
      theme: "forest",
      variant: "forest",
      tags: ["森林", "forest", "leaf", "green"],
      ...localOnly,
    },
    {
      id: "photo-city-window",
      type: "vintagePhoto",
      renderKind: "procedural-photo",
      primitive: "GeneratedVintagePhotoCard",
      width: 360,
      height: 250,
      theme: "city-night",
      variant: "city",
      tags: ["城市", "city", "night", "window"],
      ...localOnly,
    },
    {
      id: "photo-dream-memory",
      type: "vintagePhoto",
      renderKind: "procedural-photo",
      primitive: "GeneratedVintagePhotoCard",
      width: 360,
      height: 310,
      theme: "dreamy-memory",
      variant: "dream",
      tags: ["memory", "dream", "first date"],
      ...localOnly,
    },
  ],
  paperScraps: [
    {
      id: "paper-aged-letter",
      type: "paper",
      renderKind: "paper-scrap",
      primitive: "GeneratedPaperScrap",
      width: 330,
      height: 420,
      tone: "letter",
      textStyle: "handwriting",
      tags: ["paper", "letter", "手写", "writing"],
      ...localOnly,
    },
    {
      id: "paper-blue-map",
      type: "paper",
      renderKind: "paper-scrap",
      primitive: "GeneratedPaperScrap",
      width: 360,
      height: 260,
      tone: "map-blue",
      textStyle: "map",
      tags: ["map", "blue", "雪山", "海边"],
      ...localOnly,
    },
    {
      id: "paper-kraft-edge",
      type: "paper",
      renderKind: "paper-scrap",
      primitive: "GeneratedPaperScrap",
      width: 300,
      height: 360,
      tone: "kraft",
      textStyle: "plain",
      tags: ["kraft", "torn", "brown"],
      ...localOnly,
    },
    {
      id: "paper-grid-receipt",
      type: "paper",
      renderKind: "paper-scrap",
      primitive: "GeneratedPaperScrap",
      width: 260,
      height: 340,
      tone: "receipt",
      textStyle: "grid",
      tags: ["city", "receipt", "grid", "城市夜晚"],
      ...localOnly,
    },
    {
      id: "paper-soft-cyan",
      type: "paper",
      renderKind: "paper-scrap",
      primitive: "GeneratedPaperScrap",
      width: 420,
      height: 320,
      tone: "cyan",
      textStyle: "plain",
      tags: ["cyan", "sea", "blue"],
      ...localOnly,
    },
  ],
  tapeStrips: [
    {
      id: "tape-yellow-long",
      type: "tape",
      renderKind: "tape",
      primitive: "GeneratedTape",
      width: 132,
      height: 42,
      tone: "yellow",
      tags: ["tape", "yellow", "胶带"],
      ...localOnly,
    },
    {
      id: "tape-yellow-short",
      type: "tape",
      renderKind: "tape",
      primitive: "GeneratedTape",
      width: 96,
      height: 36,
      tone: "yellow",
      tags: ["tape", "paper", "胶带"],
      ...localOnly,
    },
    {
      id: "tape-blue-strip",
      type: "tape",
      renderKind: "tape",
      primitive: "GeneratedTape",
      width: 116,
      height: 30,
      tone: "blue",
      tags: ["blue", "tape", "海边"],
      ...localOnly,
    },
    {
      id: "tape-cream-corner",
      type: "tape",
      renderKind: "tape",
      primitive: "GeneratedTape",
      width: 88,
      height: 32,
      tone: "cream",
      tags: ["tape", "transparent", "corner"],
      ...localOnly,
    },
  ],
  stampLikeMarks: [
    {
      id: "postmark-cold-ink",
      type: "postmark",
      renderKind: "postmark",
      primitive: "GeneratedPostmark",
      width: 120,
      height: 120,
      tone: "blue",
      label: "POST",
      tags: ["postmark", "snow", "blue"],
      ...localOnly,
    },
    {
      id: "postmark-sea-ink",
      type: "postmark",
      renderKind: "postmark",
      primitive: "GeneratedPostmark",
      width: 112,
      height: 112,
      tone: "bluegreen",
      label: "AIR",
      tags: ["postmark", "sea", "海边"],
      ...localOnly,
    },
    {
      id: "stamp-memory-block",
      type: "stamp",
      renderKind: "stamp-like",
      primitive: "GeneratedStampLikeElement",
      width: 104,
      height: 78,
      tone: "red",
      label: "POSTCARD",
      tags: ["stamp", "red", "label"],
      ...localOnly,
    },
    {
      id: "stamp-botanical-block",
      type: "stamp",
      renderKind: "stamp-like",
      primitive: "GeneratedStampLikeElement",
      width: 88,
      height: 88,
      tone: "olive",
      label: "BOTANIC",
      tags: ["forest", "stamp", "leaf"],
      ...localOnly,
    },
  ],
  botanicalOrDecorativeElements: [
    {
      id: "deco-mountain-silhouette",
      type: "decorative",
      renderKind: "botanical-ephemera",
      primitive: "GeneratedBotanicalOrEphemera",
      width: 220,
      height: 84,
      variant: "mountain",
      tags: ["snow", "mountain", "雪山"],
      ...localOnly,
    },
    {
      id: "deco-wave-lines",
      type: "decorative",
      renderKind: "botanical-ephemera",
      primitive: "GeneratedBotanicalOrEphemera",
      width: 180,
      height: 80,
      variant: "waves",
      tags: ["sea", "wave", "海边"],
      ...localOnly,
    },
    {
      id: "deco-branch-line",
      type: "decorative",
      renderKind: "botanical-ephemera",
      primitive: "GeneratedBotanicalOrEphemera",
      width: 150,
      height: 180,
      variant: "branch",
      tags: ["forest", "leaf", "森林"],
      ...localOnly,
    },
    {
      id: "deco-moon-window",
      type: "decorative",
      renderKind: "botanical-ephemera",
      primitive: "GeneratedBotanicalOrEphemera",
      width: 160,
      height: 110,
      variant: "moon-window",
      tags: ["city", "night", "城市夜晚"],
      ...localOnly,
    },
  ],
  handwritingOrScribbleElements: [
    {
      id: "scribble-pencil-loop",
      type: "scribble",
      renderKind: "scribble",
      primitive: "GeneratedScribble",
      width: 160,
      height: 110,
      tone: "pencil",
      tags: ["scribble", "pencil", "hand"],
      ...localOnly,
    },
    {
      id: "scribble-blue-trees",
      type: "scribble",
      renderKind: "scribble",
      primitive: "GeneratedScribble",
      width: 190,
      height: 120,
      tone: "blue",
      variant: "trees",
      tags: ["forest", "snow", "tree", "blue"],
      ...localOnly,
    },
    {
      id: "scribble-memory-line",
      type: "scribble",
      renderKind: "scribble",
      primitive: "GeneratedScribble",
      width: 210,
      height: 80,
      tone: "black",
      variant: "handwriting",
      tags: ["writing", "memory", "first date"],
      ...localOnly,
    },
  ],
  smallStickerIcons: [
    {
      id: "sticker-wish-label",
      type: "sticker",
      renderKind: "sticker-icon",
      primitive: "GeneratedStampLikeElement",
      width: 166,
      height: 42,
      tone: "cream",
      label: "WISH YOU WERE HERE",
      tags: ["label", "snow", "sea", "memory"],
      ...localOnly,
    },
    {
      id: "sticker-ticket-stub",
      type: "sticker",
      renderKind: "sticker-icon",
      primitive: "GeneratedStampLikeElement",
      width: 150,
      height: 74,
      tone: "ticket",
      label: "TICKET",
      tags: ["ticket", "city", "sea"],
      ...localOnly,
    },
    {
      id: "sticker-small-cloud",
      type: "sticker",
      renderKind: "sticker-icon",
      primitive: "GeneratedBotanicalOrEphemera",
      width: 108,
      height: 54,
      variant: "cloud",
      tags: ["snow", "dream"],
      ...localOnly,
    },
    {
      id: "sticker-date-label",
      type: "sticker",
      renderKind: "sticker-icon",
      primitive: "GeneratedStampLikeElement",
      width: 118,
      height: 46,
      tone: "red",
      label: "TODAY",
      tags: ["date", "memory"],
      ...localOnly,
    },
  ],
};

export const themePacks = [
  {
    id: "snow-mountain",
    label: "snow mountain",
    keywords: ["雪山", "snow", "mountain", "山", "cold", "blue"],
    accents: ["#5d7f96", "#ece0aa", "#17212a"],
    assetIds: [
      "photo-snow-ridge",
      "paper-blue-map",
      "paper-aged-letter",
      "tape-yellow-long",
      "tape-yellow-short",
      "tape-cream-corner",
      "postmark-cold-ink",
      "stamp-memory-block",
      "deco-mountain-silhouette",
      "scribble-blue-trees",
      "scribble-pencil-loop",
      "sticker-wish-label",
      "sticker-small-cloud",
    ],
  },
  {
    id: "sea",
    label: "sea",
    keywords: ["海", "海边", "sea", "beach", "boat", "water", "cyan"],
    accents: ["#2f8aa0", "#e9c982", "#1f3340"],
    assetIds: [
      "photo-sea-horizon",
      "paper-soft-cyan",
      "paper-aged-letter",
      "tape-blue-strip",
      "tape-yellow-short",
      "tape-cream-corner",
      "postmark-sea-ink",
      "deco-wave-lines",
      "scribble-memory-line",
      "sticker-ticket-stub",
      "sticker-wish-label",
    ],
  },
  {
    id: "forest",
    label: "forest",
    keywords: ["森林", "forest", "leaf", "tree", "green", "trail"],
    accents: ["#5f704b", "#d7b477", "#263320"],
    assetIds: [
      "photo-forest-window",
      "paper-kraft-edge",
      "paper-aged-letter",
      "tape-yellow-long",
      "tape-cream-corner",
      "stamp-botanical-block",
      "deco-branch-line",
      "scribble-blue-trees",
      "scribble-pencil-loop",
      "sticker-wish-label",
    ],
  },
  {
    id: "city-night",
    label: "city night",
    keywords: ["城市", "城市夜晚", "东京", "tokyo", "night", "city", "window"],
    accents: ["#25344f", "#d45a42", "#e7d1a0"],
    assetIds: [
      "photo-city-window",
      "paper-grid-receipt",
      "paper-blue-map",
      "tape-blue-strip",
      "tape-yellow-short",
      "postmark-cold-ink",
      "stamp-memory-block",
      "deco-moon-window",
      "scribble-memory-line",
      "sticker-ticket-stub",
      "sticker-date-label",
    ],
  },
  {
    id: "dreamy-memory",
    label: "dreamy memory",
    keywords: ["memory", "dream", "date", "first date", "第一次", "回忆"],
    accents: ["#c75a42", "#83bfc8", "#27211d"],
    assetIds: [
      "photo-dream-memory",
      "paper-aged-letter",
      "paper-kraft-edge",
      "paper-soft-cyan",
      "tape-yellow-long",
      "tape-yellow-short",
      "postmark-sea-ink",
      "stamp-memory-block",
      "scribble-pencil-loop",
      "scribble-memory-line",
      "sticker-date-label",
      "sticker-wish-label",
      "sticker-small-cloud",
    ],
  },
];

const assetIndex = new Map(getAllCollageAssets().map((asset) => [asset.id, asset]));

export function getAllCollageAssets() {
  return Object.values(collageAssets).flat();
}

export function findCollageAsset(assetId) {
  return assetIndex.get(assetId);
}

export function selectThemePack(prompt = "") {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) return themePacks.at(-1);
  return themePacks.find((pack) =>
    pack.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
  ) || themePacks.at(-1);
}

export function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashString(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function between(random, min, max) {
  return min + (max - min) * random();
}

function pick(random, list) {
  return list[Math.floor(random() * list.length) % list.length];
}

function pickAsset(random, ids, predicate) {
  const pool = ids.map(findCollageAsset).filter((asset) => asset && (!predicate || predicate(asset)));
  return pick(random, pool.length ? pool : getAllCollageAssets().filter(predicate || (() => true)));
}

function jitter(random, value, amount) {
  return Number((value + between(random, -amount, amount)).toFixed(2));
}

const shapeByType = {
  vintagePhoto: ["photo-cutout", "hand-cut", "deckled-edge"],
  paper: ["torn-paper", "hand-cut", "paper-scrap", "deckled-edge"],
  tape: ["tape"],
  postmark: ["stamp-edge"],
  stamp: ["stamp-edge", "hand-cut"],
  decorative: ["hand-cut", "paper-scrap"],
  scribble: ["hand-cut"],
  sticker: ["paper-scrap", "stamp-edge", "hand-cut"],
};

const baseRecipe = [
  { type: "paper", x: 14, y: 9, scale: 1.36, z: 1, shape: "torn-paper" },
  { type: "paper", x: 64, y: 10, scale: 1.18, z: 1, shape: "paper-scrap" },
  { type: "vintagePhoto", x: 9, y: 22, scale: 1.08, z: 4, shape: "photo-cutout" },
  { type: "vintagePhoto", x: 67, y: 27, scale: 1.02, z: 6, shape: "deckled-edge" },
  { type: "paper", x: 77, y: 54, scale: 0.88, z: 3, shape: "torn-paper" },
  { type: "decorative", x: 2, y: 55, scale: 1.18, z: 2, shape: "hand-cut" },
  { type: "scribble", x: 24, y: 8, scale: 0.76, z: 6, shape: "hand-cut" },
  { type: "scribble", x: 76, y: 15, scale: 0.72, z: 8, shape: "hand-cut" },
  { type: "stamp", x: 81, y: 19, scale: 0.92, z: 10, shape: "stamp-edge" },
  { type: "postmark", x: 9, y: 67, scale: 0.84, z: 9, shape: "stamp-edge" },
  { type: "sticker", x: 55, y: 7, scale: 0.84, z: 9, shape: "paper-scrap" },
  { type: "sticker", x: 86, y: 71, scale: 0.72, z: 9, shape: "hand-cut" },
  { type: "paper", x: 4, y: 77, scale: 0.78, z: 2, shape: "deckled-edge" },
  { type: "tape", x: 28, y: 28, scale: 0.86, z: 12, shape: "tape" },
  { type: "tape", x: 71, y: 35, scale: 0.82, z: 12, shape: "tape" },
  { type: "tape", x: 18, y: 64, scale: 0.76, z: 12, shape: "tape" },
  { type: "tape", x: 84, y: 49, scale: 0.78, z: 12, shape: "tape" },
  { type: "decorative", x: 48, y: 80, scale: 0.72, z: 5, shape: "paper-scrap" },
];

function assetTypeForRecipe(type) {
  if (type === "vintagePhoto") return "vintagePhoto";
  if (type === "stamp") return "stamp";
  return type;
}

export function createHeroComposition({
  coupleId,
  questionId,
  date,
  themePrompt = "",
  uploadedPhotos = [],
} = {}) {
  const theme = selectThemePack(themePrompt);
  const random = createSeededRandom(`${coupleId || "couple"}:${questionId || "question"}:${date || "date"}:${themePrompt || theme.id}`);
  const photoInsertIndex = uploadedPhotos.length ? 3 : -1;

  return baseRecipe.map((recipe, index) => {
    const upload = index === photoInsertIndex ? uploadedPhotos[0] : null;
    const asset = upload
      ? {
        id: upload.id,
        type: "vintagePhoto",
        renderKind: "uploaded-photo",
        primitive: "GeneratedVintagePhotoCard",
        width: 420,
        height: 300,
        theme: theme.id,
        variant: "upload",
        tags: [upload.name || "uploaded photo"],
        src: upload.url,
        source: "upload",
      }
      : pickAsset(random, theme.assetIds, (candidate) => candidate.type === assetTypeForRecipe(recipe.type));
    const shapeList = shapeByType[asset.type] || ["paper-scrap"];
    const shapeVariant = recipe.shape || pick(random, shapeList);

    return {
      id: `collage-${index + 1}-${asset.id}`,
      assetId: asset.id,
      type: asset.type,
      primitive: asset.primitive,
      renderKind: asset.renderKind,
      shapeVariant,
      x: jitter(random, recipe.x, 2.2),
      y: jitter(random, recipe.y, 2.2),
      rotation: Number(between(random, -8.5, 8.5).toFixed(2)),
      scale: Number(jitter(random, recipe.scale, 0.08).toFixed(2)),
      zIndex: recipe.z + Math.floor(between(random, 0, 3)),
      opacity: Number(between(random, 0.78, 0.98).toFixed(2)),
      shadow: Number(between(random, 0.48, 0.86).toFixed(2)),
      blendMode: asset.type === "tape" || asset.type === "postmark" ? "multiply" : "normal",
      width: asset.width,
      height: asset.height,
      src: asset.src || "",
      tone: asset.tone || "",
      variant: asset.variant || "",
      label: asset.label || "",
      themeId: theme.id,
      themeLabel: theme.label,
      accents: theme.accents,
      tags: [...(asset.tags || [])],
    };
  });
}

export function chooseReplacementItem(query, attempt = 0, seedOptions = {}) {
  const theme = selectThemePack(query);
  const random = createSeededRandom(`${seedOptions.coupleId || "couple"}:${seedOptions.date || "date"}:${query}:${attempt}`);
  const candidates = theme.assetIds
    .map(findCollageAsset)
    .filter(Boolean)
    .filter((asset) => asset.type !== "tape");
  const asset = candidates[attempt % candidates.length] || pick(random, candidates);
  return {
    id: `replacement-${attempt}-${asset.id}`,
    assetId: asset.id,
    type: asset.type,
    primitive: asset.primitive,
    renderKind: asset.renderKind,
    shapeVariant: pick(random, shapeByType[asset.type] || ["paper-scrap"]),
    x: 0,
    y: 0,
    rotation: Number(between(random, -6, 6).toFixed(2)),
    scale: 1,
    zIndex: 1,
    opacity: 0.95,
    shadow: 0.68,
    blendMode: asset.type === "postmark" ? "multiply" : "normal",
    width: asset.width,
    height: asset.height,
    src: asset.src || "",
    tone: asset.tone || "",
    variant: asset.variant || "",
    label: asset.label || query || theme.label,
    themeId: theme.id,
    themeLabel: theme.label,
    accents: theme.accents,
    tags: [...(asset.tags || [])],
  };
}

function setStyleNumber(element, name, value, unit = "") {
  element.style.setProperty(name, `${value}${unit}`);
}

export function createRetroCollageElement(item, options = {}) {
  const element = document.createElement(options.interactive === false ? "figure" : "button");
  if (element.tagName === "BUTTON") element.type = "button";
  element.className = [
    "retro-collage-element",
    `shape-${item.shapeVariant}`,
    `primitive-${item.primitive}`,
    `render-${item.renderKind}`,
    `tone-${item.tone || "default"}`,
    `theme-${item.themeId || "default"}`,
  ].join(" ");
  element.dataset.collageElement = item.id;
  element.dataset.assetId = item.assetId;
  element.dataset.primitive = item.primitive;
  element.dataset.renderKind = item.renderKind;
  element.dataset.shapeVariant = item.shapeVariant;
  element.dataset.collageType = item.type;
  element.dataset.replaceable = item.id;
  element.dataset.searchHint = item.themeLabel || item.label || item.tags?.[0] || "memory";
  element.setAttribute("aria-label", options.ariaLabel || `${item.themeLabel || "memory"} collage element`);

  setStyleNumber(element, "--x", item.x, "%");
  setStyleNumber(element, "--y", item.y, "%");
  setStyleNumber(element, "--r", item.rotation, "deg");
  setStyleNumber(element, "--s", item.scale);
  setStyleNumber(element, "--z", item.zIndex);
  setStyleNumber(element, "--o", item.opacity);
  setStyleNumber(element, "--shadow", item.shadow);
  setStyleNumber(element, "--w", item.width, "px");
  setStyleNumber(element, "--h", item.height, "px");
  element.style.setProperty("--ratio", `${item.width} / ${item.height}`);
  element.style.setProperty("--blend", item.blendMode || "normal");
  element.style.setProperty("--accent-a", item.accents?.[0] || "#7b8c8f");
  element.style.setProperty("--accent-b", item.accents?.[1] || "#e2c77b");
  element.style.setProperty("--accent-c", item.accents?.[2] || "#24201b");

  const content = document.createElement("span");
  content.className = "retro-collage-content";

  if (item.src) {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.label || "uploaded collage photo";
    image.width = item.width;
    image.height = item.height;
    image.loading = "lazy";
    image.decoding = "async";
    content.append(image);
  } else {
    renderProceduralContent(content, item);
  }

  element.append(content);
  return element;
}

export function renderProceduralContent(content, item) {
  content.dataset.kind = item.renderKind;
  content.dataset.variant = item.variant || item.tone || "";

  if (item.renderKind === "procedural-photo") {
    content.innerHTML = `
      <span class="generated-photo-sky"></span>
      <span class="generated-photo-land"></span>
      <span class="generated-photo-detail"></span>
    `;
    return;
  }

  if (item.renderKind === "paper-scrap") {
    content.innerHTML = `
      <span class="generated-paper-lines"></span>
      <span class="generated-paper-mark">${item.tone === "receipt" ? "77" : ""}</span>
    `;
    return;
  }

  if (item.renderKind === "tape") {
    content.innerHTML = `<span class="generated-tape-fibers"></span>`;
    return;
  }

  if (item.renderKind === "postmark") {
    content.innerHTML = `
      <span class="generated-postmark-ring"></span>
      <span class="generated-postmark-lines"></span>
      <span class="generated-postmark-label">${item.label || "POST"}</span>
    `;
    return;
  }

  if (item.renderKind === "stamp-like" || item.renderKind === "sticker-icon") {
    content.innerHTML = `<span class="generated-label-text">${item.label || ""}</span>`;
    return;
  }

  if (item.renderKind === "botanical-ephemera") {
    content.innerHTML = `<span class="generated-ephemera-lines"></span>`;
    return;
  }

  if (item.renderKind === "scribble") {
    content.innerHTML = `<span class="generated-scribble-line"></span>`;
  }
}
