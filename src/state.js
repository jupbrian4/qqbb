import { chooseReplacementItem } from "./collageSystem.js";

const baseElements = [
  {
    id: "date",
    type: "date",
    role: "functional",
    replaceable: false,
    treatment: ["printed"],
    source: "system",
  },
  {
    id: "postcard-front-a",
    type: "photo",
    role: "postcard-front",
    replaceable: true,
    treatment: ["postcard-photo", "soft-grain"],
    source: "procedural",
  },
  {
    id: "postcard-front-b",
    type: "photo",
    role: "postcard-front",
    replaceable: true,
    treatment: ["postcard-photo", "soft-grain"],
    source: "procedural",
  },
  {
    id: "upload-slot-1",
    type: "photo",
    role: "upload-placeholder",
    replaceable: true,
    treatment: ["seed-photo", "paper-edge", "soft-grain"],
    source: "procedural-placeholder",
  },
  {
    id: "upload-slot-2",
    type: "photo",
    role: "upload-placeholder",
    replaceable: true,
    treatment: ["seed-photo", "paper-edge", "soft-grain"],
    source: "procedural-placeholder",
  },
  {
    id: "upload-slot-3",
    type: "photo",
    role: "upload-placeholder",
    replaceable: true,
    treatment: ["seed-photo", "paper-edge", "soft-grain"],
    source: "procedural-placeholder",
  },
  {
    id: "scene-a",
    type: "photo",
    role: "decorative",
    replaceable: true,
    treatment: ["desaturated", "paper-edge", "soft-grain", "torn-edge"],
    source: "placeholder",
  },
  {
    id: "scene-b",
    type: "photo",
    role: "decorative",
    replaceable: true,
    treatment: ["cool-crop", "white-border", "soft-grain"],
    source: "placeholder",
  },
  {
    id: "letter-a",
    type: "paper",
    role: "decorative",
    replaceable: true,
    treatment: ["handwritten-layer", "soft-grain", "torn-edge"],
    source: "placeholder",
  },
  {
    id: "type-a",
    type: "type",
    role: "decorative",
    replaceable: true,
    treatment: ["magazine-cutout", "high-contrast"],
    source: "placeholder",
  },
  {
    id: "stamp-a",
    type: "stamp",
    role: "decorative",
    replaceable: true,
    treatment: ["postal-red", "soft-grain"],
    source: "placeholder",
  },
  {
    id: "strip-a",
    type: "paper",
    role: "decorative",
    replaceable: true,
    treatment: ["postal-blue", "paper-strip"],
    source: "placeholder",
  },
  {
    id: "shape-a",
    type: "paper",
    role: "decorative",
    replaceable: true,
    treatment: ["black-paper", "paper-cut"],
    source: "placeholder",
  },
  {
    id: "tape-a",
    type: "tape",
    role: "decorative",
    replaceable: true,
    treatment: ["yellow-tape", "translucent"],
    source: "placeholder",
  },
  {
    id: "tape-b",
    type: "tape",
    role: "decorative",
    replaceable: true,
    treatment: ["yellow-tape", "translucent"],
    source: "placeholder",
  },
];

const basePastEntries = [
  {
    date: "2026-06-18",
    sources: ["postcard-front-a", "postcard-back-fragment", "postcard-front-b", "type-fragment"],
    composition: "single-postcard-mosaic",
  },
  {
    date: "2026-06-17",
    sources: ["postcard-front-b", "postcard-front-a", "paper-strip", "postcard-back-fragment"],
    composition: "single-postcard-mosaic",
  },
  {
    date: "2026-06-16",
    sources: ["uploaded-photo", "postcard-front-b", "postcard-front-a", "stamp-fragment"],
    composition: "single-postcard-mosaic",
  },
];

export function createInitialState() {
  return {
    date: "2026-06-22",
    postcards: {
      a: {
        id: "a",
        owner: "A",
        flipped: false,
        archived: false,
        frontElementId: "postcard-front-a",
      },
      b: {
        id: "b",
        owner: "B",
        flipped: false,
        archived: false,
        frontElementId: "postcard-front-b",
      },
    },
    lucky: {
      active: false,
      selectedElementId: null,
    },
    elements: baseElements.map((element) => ({ ...element })),
    uploads: [],
    pastEntries: basePastEntries.map((entry) => ({
      ...entry,
      sources: [...entry.sources],
    })),
  };
}

export function flipPostcard(state, postcardId) {
  const postcard = state.postcards[postcardId];
  if (!postcard) {
    throw new Error(`Unknown postcard: ${postcardId}`);
  }

  return {
    ...state,
    postcards: {
      ...state.postcards,
      [postcardId]: {
        ...postcard,
        flipped: !postcard.flipped,
      },
    },
  };
}

export function activateLucky(state) {
  return {
    ...state,
    lucky: {
      active: true,
      selectedElementId: null,
    },
  };
}

export function toggleLucky(state) {
  return {
    ...state,
    lucky: {
      active: !state.lucky.active,
      selectedElementId: null,
    },
  };
}

export function selectLuckyElement(state, elementId) {
  const element = state.elements.find((item) => item.id === elementId);
  const generatedElement = /^collage-|^replacement-/.test(elementId);
  if (!state.lucky.active) {
    throw new Error("Lucky mode is not active");
  }
  if ((!element || !element.replaceable) && !generatedElement) {
    throw new Error(`Element is not replaceable: ${elementId}`);
  }

  return {
    ...state,
    lucky: {
      active: true,
      selectedElementId: elementId,
    },
  };
}

export function addUploadedImage(state, image) {
  const id = `upload-${state.uploads.length + 1}`;
  const uploadedElement = {
    id,
    type: "photo",
    role: "decorative",
    replaceable: true,
    treatment: ["cropped", "desaturated", "paper-edge", "soft-grain", "tilted"],
    source: "upload",
    image,
  };

  return {
    ...state,
    uploads: [...state.uploads, { id, ...image }],
    elements: [...state.elements, uploadedElement],
  };
}

export function archivePostcard(state, postcardId) {
  const postcard = state.postcards[postcardId];
  if (!postcard) {
    throw new Error(`Unknown postcard: ${postcardId}`);
  }

  const sourceId = postcard.frontElementId;
  const alreadyArchivedToday = state.pastEntries.some((entry) =>
    entry.date === state.date && entry.sources.includes(sourceId),
  );
  const archiveEntry = {
    date: state.date,
    sources: [sourceId, "postcard-back-fragment", postcardId === "a" ? "postcard-front-b" : "postcard-front-a", "stamp-fragment"],
    composition: "single-postcard-mosaic",
  };

  return {
    ...state,
    postcards: {
      ...state.postcards,
      [postcardId]: {
        ...postcard,
        archived: true,
      },
    },
    pastEntries: alreadyArchivedToday ? state.pastEntries : [archiveEntry, ...state.pastEntries],
  };
}

export function buildPastCollectionCards(entries) {
  return entries.map((entry) => ({
    kind: "date-collage",
    presentation: "single-postcard-mosaic",
    date: entry.date,
    composition: entry.composition,
    sources: [...entry.sources],
    dateIndexHidden: true,
  }));
}

export function createReplacementCandidate(query, attempt = 0) {
  return {
    ...chooseReplacementItem(query, attempt),
    query,
    attempt,
  };
}
