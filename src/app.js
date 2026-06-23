import {
  addUploadedImage,
  archivePostcard,
  buildPastCollectionCards,
  createInitialState,
  flipPostcard,
  toggleLucky,
} from "./state.js";
import {
  createHeroComposition,
  createRetroCollageElement,
  hashString,
} from "./collageSystem.js";

let state = createInitialState();
let activeThemePrompt = "dreamy-memory";
let themeAttempt = 0;
let activeRansomPhrase = "wish you were here";
let activeArchiveBatch = 0;

const coupleId = "qqbb";
const questionId = "daily-question";
const isPreviewMode = new URLSearchParams(window.location.search).has("preview");
const localPhotoAssets = [
  "public/collage-optimized/landscape/39e599e0245da9af560bfe32b93476.webp",
  "public/collage-optimized/landscape/44e8829791aee3c0c6614c39b78aff.webp",
  "public/collage-optimized/landscape/6f790bc2fec79924570e31efdf3bdb.webp",
  "public/collage-optimized/old photos/1.webp",
  "public/collage-optimized/old photos/3.webp",
  "public/collage-optimized/old photos/4.webp",
];
const ransomPhrases = [
  "are you dreaming?",
  "wish you were here",
  "one more question",
  "remember this",
  "keep this somewhere",
  "what did you mean?",
];
const mockUploads = [
  {
    id: "preview-upload-1",
    name: "window memory",
    url: "public/collage-optimized/old photos/1.webp",
  },
  {
    id: "preview-upload-2",
    name: "quiet landscape",
    url: "public/collage-optimized/landscape/44e8829791aee3c0c6614c39b78aff.webp",
  },
];
const root = document.querySelector(".scrapbook-hero");
const collageLayer = document.querySelector("[data-collage-layer]");
const postcardEls = [...document.querySelectorAll("[data-postcard]")];
const postcardFronts = [...document.querySelectorAll(".photo-frame[data-replaceable]")];
const heroDate = document.querySelector("[data-date-fragment], .hero-date");
const ransomNote = document.querySelector("[data-ransom-note]");
const luckyButton = document.querySelector("[data-lucky-button]");
const uploadButton = document.querySelector("[data-upload-button]");
const uploadInput = document.querySelector("[data-upload-input]");
const uploadLayer = document.querySelector("[data-upload-layer]");
const replacePanel = document.querySelector("[data-replace-panel]");
const replaceInput = document.querySelector("[data-replace-input]");
const replaceStatus = document.querySelector("[data-replace-status]");
const retryButton = document.querySelector("[data-retry-button]");
const applyButton = document.querySelector("[data-apply-button]");
const openPastButton = document.querySelector("[data-open-past]");
const pastSection = document.querySelector("[data-past-section]");
const collectionGrid = document.querySelector("[data-collection-grid]");
const archiveDetail = document.querySelector("[data-archive-detail]");
const returnHomeButton = document.querySelector("[data-return-home]");
const archivePrevButton = document.querySelector("[data-archive-prev]");
const archiveNextButton = document.querySelector("[data-archive-next]");
const exportArchiveButton = document.querySelector("[data-export-archive]");
const archiveButtons = [...document.querySelectorAll("[data-archive-postcard]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderDateFragment() {
  if (!heroDate) return;
  const date = new Date(`${state.date}T12:00:00`);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  heroDate.innerHTML = `<span>${year}</span><strong>${month} ${day}</strong><small>${weekday}</small>`;
}

function setCardsReadOnly(readOnly) {
  postcardEls.forEach((card) => {
    card.querySelectorAll("textarea").forEach((textarea) => {
      textarea.readOnly = readOnly;
    });
  });
}

function setPostcardCover(postcardId, covered) {
  const card = document.querySelector(`[data-postcard="${postcardId}"]`);
  card?.classList.toggle("has-covered-answer", covered);
}

function resetPostcardPreviewClasses() {
  postcardEls.forEach((card) => {
    card.classList.remove("has-covered-answer", "is-demo-revealed");
  });
  document.querySelector(".postcard-stage")?.classList.remove("is-ready-reveal", "is-revealed");
}

state = {
  ...state,
  date: getTodayKey(),
};

function hasGsap() {
  return Boolean(window.gsap) && !reduceMotion;
}

function animateIn(element) {
  if (!hasGsap()) {
    element.classList.add("settled");
    return;
  }
  window.gsap.fromTo(
    element,
    { autoAlpha: 0, y: 12, rotate: -4 },
    { autoAlpha: 1, y: 0, rotate: 0, duration: 0.34, ease: "power2.out" },
  );
}

function animatePress(element) {
  if (!hasGsap()) {
    element.classList.add("stamp-pressed");
    window.setTimeout(() => element.classList.remove("stamp-pressed"), 260);
    return;
  }
  window.gsap.fromTo(
    element,
    { scale: 0.96, y: 4 },
    { scale: 1, y: 0, duration: 0.18, ease: "power2.out" },
  );
}

function renderRansomPhrase(phrase = activeRansomPhrase, variant = 0) {
  if (!ransomNote) return;
  activeRansomPhrase = phrase;
  ransomNote.replaceChildren();
  const words = phrase.split(/\s+/).filter(Boolean).slice(0, 7);
  words.forEach((word, index) => {
    const wordEl = document.createElement("span");
    wordEl.textContent = word;
    wordEl.style.setProperty("--word-r", `${((hashString(`${phrase}:${index}:${variant}`) % 11) - 5) * 0.65}deg`);
    wordEl.style.setProperty("--word-y", `${((hashString(`${word}:${variant}`) % 7) - 3) * 1.5}px`);
    wordEl.dataset.wordLength = String(Math.min(word.length, 10));
    ransomNote.append(wordEl);
  });
  ransomNote.classList.toggle("is-refreshed", variant > 0);
}

function phraseForPrompt(prompt, attempt = 0) {
  const normalized = prompt.trim().toLowerCase();
  const direct = ransomPhrases.find((phrase) => normalized && phrase.includes(normalized));
  if (direct) return direct;
  const index = hashString(`${normalized || "memory"}:${attempt}:${state.date}`) % ransomPhrases.length;
  return ransomPhrases[index];
}

function renderHeroCollage() {
  const themePrompt = themeAttempt > 0 ? `${activeThemePrompt} variant ${themeAttempt}` : activeThemePrompt;
  const items = createHeroComposition({
    coupleId,
    questionId,
    date: state.date,
    themePrompt,
    uploadedPhotos: [],
  });

  collageLayer.replaceChildren();
  items.forEach((item) => {
    const element = createRetroCollageElement(item, {
      ariaLabel: `${item.themeLabel} 拼贴元素`,
    });
    collageLayer.append(element);
  });

  renderUploadSlots();
  renderPostcardFronts(items);
  renderDateFragment();
  renderRansomPhrase();
}

function renderUploadSlots() {
  const placeholders = [
    {
      id: "upload-slot-1",
      assetId: "upload-slot-1",
      type: "vintagePhoto",
      primitive: "GeneratedVintagePhotoCard",
      renderKind: "procedural-photo",
      shapeVariant: "deckled-edge",
      x: 8,
      y: 57,
      rotation: -4,
      scale: 0.62,
      zIndex: 8,
      opacity: 0.9,
      shadow: 0.72,
      blendMode: "normal",
      width: 360,
      height: 250,
      src: "",
      tone: "",
      variant: "forest",
      label: "upload one",
      themeId: "forest",
      themeLabel: "forest",
      accents: ["#5f704b", "#d7b477", "#263320"],
      tags: ["upload"],
    },
    {
      id: "upload-slot-2",
      assetId: "upload-slot-2",
      type: "vintagePhoto",
      primitive: "GeneratedVintagePhotoCard",
      renderKind: "procedural-photo",
      shapeVariant: "photo-cutout",
      x: 37,
      y: 14,
      rotation: 2.5,
      scale: 0.55,
      zIndex: 7,
      opacity: 0.86,
      shadow: 0.62,
      blendMode: "normal",
      width: 360,
      height: 260,
      src: "",
      tone: "",
      variant: "city",
      label: "upload two",
      themeId: "city-night",
      themeLabel: "city night",
      accents: ["#25344f", "#d45a42", "#e7d1a0"],
      tags: ["upload"],
    },
    {
      id: "upload-slot-3",
      assetId: "upload-slot-3",
      type: "vintagePhoto",
      primitive: "GeneratedVintagePhotoCard",
      renderKind: "procedural-photo",
      shapeVariant: "hand-cut",
      x: 79,
      y: 64,
      rotation: -6,
      scale: 0.52,
      zIndex: 7,
      opacity: 0.88,
      shadow: 0.68,
      blendMode: "normal",
      width: 360,
      height: 250,
      src: "",
      tone: "",
      variant: "sea",
      label: "upload three",
      themeId: "sea",
      themeLabel: "sea",
      accents: ["#2f8aa0", "#e9c982", "#1f3340"],
      tags: ["upload"],
    },
  ];

  uploadLayer.replaceChildren();
  placeholders.forEach((placeholder, index) => {
    const upload = state.uploads[index];
    const item = upload
      ? {
        ...placeholder,
        id: upload.id,
        assetId: upload.id,
        renderKind: "uploaded-photo",
        src: upload.url,
        label: upload.name,
        variant: "upload",
      }
      : placeholder;
    const element = createRetroCollageElement(item, {
      ariaLabel: upload ? "上传后经过视觉处理的拼贴图片" : `上传图片位置 ${index + 1}`,
    });
    element.classList.add("upload-placeholder", `upload-slot-${index + 1}`);
    if (upload) element.classList.add("has-user-upload");
    element.dataset.uploadSlot = String(index + 1);
    element.addEventListener("click", (event) => {
      if (isPreviewMode) {
        event.stopPropagation();
        renderDesignPreviewState(index === 0 ? "upload-one" : "upload-two");
        return;
      }
      if (state.lucky.active) return;
      event.stopPropagation();
      uploadInput.click();
    });
    uploadLayer.append(element);
  });
}

function renderPostcardFronts(items) {
  const photoItems = items.filter((item) => item.type === "vintagePhoto");
  postcardFronts.forEach((front, index) => {
    const photo = photoItems[index % photoItems.length];
    const localPhoto = localPhotoAssets[index % 3];
    front.dataset.photoTheme = photo?.themeId || "dreamy-memory";
    front.dataset.photoVariant = photo?.variant || "dream";
    front.style.setProperty("--accent-a", photo?.accents?.[0] || "#7b8c8f");
    front.style.setProperty("--accent-b", photo?.accents?.[1] || "#e2c77b");
    front.style.setProperty("--accent-c", photo?.accents?.[2] || "#24201b");
    front.style.setProperty("--photo-image", `url("${localPhoto}")`);
    front.classList.add("has-local-photo");
  });
}

function setPostcardClasses() {
  postcardEls.forEach((card) => {
    const id = card.dataset.postcard;
    card.classList.toggle("is-flipped", state.postcards[id].flipped);
    card.classList.toggle("is-archived", state.postcards[id].archived);
    const imprint = card.querySelector(".archive-imprint");
    if (imprint) {
      imprint.innerHTML = `ARCHIVED<br />${state.date.slice(5).replace("-", ".")}`;
    }
    updateStampReadiness(card);
    const archiveButton = card.querySelector("[data-archive-postcard]");
    if (archiveButton) {
      archiveButton.disabled = state.postcards[id].archived;
      archiveButton.setAttribute("aria-label", state.postcards[id].archived ? "这张明信片已归档" : "盖邮戳并归档这张明信片");
    }
  });
}

function updateStampReadiness(card) {
  const id = card.dataset.postcard;
  const answer = card.querySelectorAll("textarea")[1]?.value.trim() || "";
  const ready = state.postcards[id].flipped && answer.length >= 8 && !state.postcards[id].archived;
  card.classList.toggle("is-ready-to-stamp", ready);
  const stampButton = card.querySelector("[data-archive-postcard]");
  if (!stampButton) return;
  if (ready) {
    stampButton.style.setProperty("opacity", "1", "important");
    stampButton.style.setProperty("visibility", "visible", "important");
    stampButton.style.setProperty("pointer-events", "auto", "important");
    stampButton.style.setProperty("transition", "none", "important");
    return;
  }
  stampButton.style.removeProperty("opacity");
  stampButton.style.removeProperty("visibility");
  stampButton.style.removeProperty("pointer-events");
  stampButton.style.removeProperty("transition");
}

function togglePostcard(card) {
  if (isPreviewMode) return;
  const interactive = document.activeElement?.matches("textarea, input, button");
  if (interactive && card.contains(document.activeElement)) return;

  state = flipPostcard(state, card.dataset.postcard);
  setPostcardClasses();
}

postcardEls.forEach((card) => {
  card.addEventListener("click", () => togglePostcard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    togglePostcard(card);
  });
  card.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => updateStampReadiness(card));
  });
});

function setReplaceStatus(message) {
  replaceStatus.textContent = message;
}

function closeLuckyPanel() {
  replacePanel.hidden = true;
  root.classList.remove("lucky-active");
  luckyButton.textContent = "I'm feeling lucky";
  luckyButton.setAttribute("aria-pressed", "false");
  setReplaceStatus("");
}

function openLuckyPanel() {
  replacePanel.hidden = false;
  root.classList.add("lucky-active");
  luckyButton.textContent = "Done";
  luckyButton.setAttribute("aria-pressed", "true");
  replaceInput.value = activeThemePrompt === "dreamy-memory" ? "" : activeThemePrompt;
  setReplaceStatus("输入一个主题后，只刷新一条剪贴短句，主画面保持稳定。");
  replaceInput.focus();
}

luckyButton.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("lucky-ransom");
    return;
  }
  state = toggleLucky(state);
  if (state.lucky.active) {
    openLuckyPanel();
  } else {
    closeLuckyPanel();
  }
});

function applyThemeFromInput({ close = true, nextVariant = false } = {}) {
  const themeValue = replaceInput.value.trim() || "dreamy-memory";
  activeThemePrompt = themeValue;
  themeAttempt = nextVariant ? themeAttempt + 1 : 0;
  const phrase = phraseForPrompt(activeThemePrompt, themeAttempt);
  renderRansomPhrase(phrase, themeAttempt + 1);
  setReplaceStatus("剪贴短句已刷新，拼贴位置保持不变。");
  if (close) {
    state = state.lucky.active ? toggleLucky(state) : state;
    closeLuckyPanel();
  }
}

retryButton.addEventListener("click", () => {
  applyThemeFromInput({ close: false, nextVariant: true });
});

applyButton.addEventListener("click", () => {
  applyThemeFromInput();
});

replaceInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyThemeFromInput();
  }
});

uploadButton.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("upload-one");
    return;
  }
  uploadInput.click();
});

uploadInput.addEventListener("change", () => {
  if (isPreviewMode) return;
  const files = [...(uploadInput.files || [])];
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    state = addUploadedImage(state, { name: file.name, url });
  });
  uploadInput.value = "";
  renderHeroCollage();
});

function displayModeForCard(card) {
  return hashString(`${card.date}:${coupleId}`) % 2 === 0 ? "front-front" : "front-back";
}

function renderArchiveCard(card, index) {
  const button = document.createElement("button");
  const mode = displayModeForCard(card);
  button.className = `archive-postcard archive-postcard-${index + 1} mode-${mode}`;
  button.type = "button";
  button.setAttribute("aria-label", "查看一张归档明信片");
  button.style.setProperty("--fan", `${(index - 2) * 6.5}deg`);
  button.style.setProperty("--lift", `${index % 2 === 0 ? 0 : 18}px`);
  button.style.setProperty("--archive-img-a", `url("${localPhotoAssets[index % localPhotoAssets.length]}")`);
  button.style.setProperty("--archive-img-b", `url("${localPhotoAssets[(index + 2) % localPhotoAssets.length]}")`);

  button.innerHTML = `
    <span class="archive-postcard-face">
      <span class="archive-landscape archive-landscape-a"></span>
      <span class="archive-landscape archive-landscape-b"></span>
      <span class="archive-writing-fragment">
        <span>今天想问你</span>
        <i>如果今天是一张照片，它会是什么颜色？</i>
      </span>
      <span class="archive-tape tape-a"></span>
      <span class="archive-tape tape-b"></span>
      <span class="archive-postmark"></span>
      <span class="archive-date" data-date="${card.date}" aria-hidden="true"></span>
    </span>
  `;

  button.addEventListener("click", () => {
    const isOpen = button.classList.toggle("is-open");
    const dateLabel = button.querySelector(".archive-date");
    if (dateLabel && isOpen) {
      dateLabel.textContent = dateLabel.dataset.date || card.date;
      dateLabel.setAttribute("aria-hidden", "false");
      dateLabel.style.setProperty("opacity", "1", "important");
      dateLabel.style.setProperty("transform", "translateY(0)", "important");
      dateLabel.style.setProperty("transition", "none", "important");
    } else if (dateLabel) {
      dateLabel.textContent = "";
      dateLabel.setAttribute("aria-hidden", "true");
      dateLabel.style.removeProperty("opacity");
      dateLabel.style.removeProperty("transform");
      dateLabel.style.removeProperty("transition");
    }
    button.setAttribute("aria-label", isOpen ? `${card.date} 的归档明信片` : "查看一张归档明信片");
  });

  return button;
}

function renderPastCollection() {
  const cards = buildPastCollectionCards(state.pastEntries);
  pastSection.dataset.archiveState = cards.length ? "batch" : "empty";
  archiveDetail.hidden = true;
  archiveDetail.replaceChildren();
  collectionGrid.replaceChildren();
  if (!cards.length) {
    renderArchiveEmpty();
    return;
  }
  renderArchiveBatch(cards);
}

function createPreviewArchiveEntries() {
  return [
    { date: "2026-06-18", sources: ["a", "b"], composition: "front-back" },
    { date: "2026-06-17", sources: ["a", "b"], composition: "front-front" },
    { date: "2026-06-16", sources: ["a", "b"], composition: "front-back" },
    { date: "2026-06-15", sources: ["a", "b"], composition: "front-front" },
    { date: "2026-06-14", sources: ["a", "b"], composition: "front-back" },
  ];
}

function renderArchiveEmpty() {
  collectionGrid.replaceChildren();
  pastSection.dataset.archiveState = "empty";
  const empty = document.createElement("div");
  empty.className = "archive-empty-state";
  empty.innerHTML = `
    <span class="empty-postcard-outline empty-one"></span>
    <span class="empty-postcard-outline empty-two"></span>
    <span class="empty-note">还没有归档的明信片</span>
  `;
  collectionGrid.append(empty);
}

function renderArchiveBatch(cards, selectedIndex = -1) {
  collectionGrid.replaceChildren();
  pastSection.dataset.archiveState = selectedIndex >= 0 ? "detail" : "batch";
  cards.forEach((card, index) => {
    const element = renderArchiveCard(card, index);
    if (index === selectedIndex) {
      element.classList.add("is-open");
      const dateLabel = element.querySelector(".archive-date");
      if (dateLabel) {
        dateLabel.textContent = card.date;
        dateLabel.setAttribute("aria-hidden", "false");
      }
    }
    collectionGrid.append(element);
  });
}

function renderArchiveDetail(card) {
  archiveDetail.hidden = false;
  archiveDetail.innerHTML = `
    <article class="archive-detail-card">
      <button type="button" class="archive-detail-close" data-close-detail>收回这一张</button>
      <p class="detail-date">${card.date}</p>
      <div class="detail-columns">
        <section>
          <h3>A 问 B</h3>
          <p>如果今天是一张照片，它会是什么颜色？</p>
          <p class="ink-answer">我想它会有一点蓝色，像窗边还没有完全暗下来的天。</p>
        </section>
        <section>
          <h3>B 问 A</h3>
          <p>有没有一个很小的瞬间，让今天变得不一样？</p>
          <p class="ink-answer">有。电梯门快关上的时候，突然想起要给你留一张今天的明信片。</p>
        </section>
      </div>
      <span class="detail-postmark">READ<br />${card.date.slice(5)}</span>
    </article>
  `;
  archiveDetail.querySelector("[data-close-detail]")?.addEventListener("click", () => {
    renderArchiveBatch(createPreviewArchiveEntries());
    archiveDetail.hidden = true;
  });
}

openPastButton.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("archive-batch");
    return;
  }
  renderPastCollection();
  pastSection.hidden = false;
  pastSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
});

returnHomeButton?.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("hero-initial");
    return;
  }
  pastSection.hidden = true;
  root.hidden = false;
  root.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
});

archivePrevButton?.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("archive-batch");
    return;
  }
  activeArchiveBatch = Math.max(0, activeArchiveBatch - 1);
  renderArchiveBatch(buildPastCollectionCards(state.pastEntries));
});

archiveNextButton?.addEventListener("click", () => {
  if (isPreviewMode) {
    renderDesignPreviewState("archive-batch");
    return;
  }
  activeArchiveBatch += 1;
  renderArchiveBatch(buildPastCollectionCards(state.pastEntries));
});

exportArchiveButton?.addEventListener("click", () => {
  if (isPreviewMode) {
    pastSection.dataset.archiveState = "export";
    exportArchiveButton.textContent = "导出预览";
    return;
  }
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), entries: state.pastEntries }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "qqbb-postcard-archive.json";
  link.click();
  URL.revokeObjectURL(url);
});

archiveButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (isPreviewMode) return;
    const postcardId = button.dataset.archivePostcard;
    state = archivePostcard(state, postcardId);
    setPostcardClasses();
    const card = document.querySelector(`[data-postcard="${postcardId}"]`);
    const imprint = card?.querySelector(".archive-imprint");
    if (hasGsap() && imprint) {
      window.gsap.fromTo(
        imprint,
        { autoAlpha: 0, scale: 1.45, rotate: -18 },
        { autoAlpha: 1, scale: 1, rotate: -12, duration: 0.24, ease: "power2.out" },
      );
    }
    animatePress(button);
    renderPastCollection();
  });
});

const PREVIEW_STATES = [
  { id: "hero-initial", label: "Hero 初始" },
  { id: "postcard-front", label: "正面" },
  { id: "postcard-back", label: "背面书写" },
  { id: "one-stamped-waiting", label: "单方盖章" },
  { id: "both-stamped-ready", label: "双方待揭开" },
  { id: "revealed", label: "已揭开" },
  { id: "archive-empty", label: "归档空态" },
  { id: "archive-batch", label: "归档摊牌" },
  { id: "archive-selected", label: "选中详情" },
  { id: "lucky-ransom", label: "Lucky 短句" },
  { id: "upload-one", label: "上传 1 张" },
  { id: "upload-two", label: "上传 2 张" },
  { id: "export-archive", label: "导出归档" },
];

function resetPreviewShell(stateId) {
  document.body.classList.add("design-preview-mode");
  document.body.dataset.previewState = stateId;
  root.hidden = false;
  pastSection.hidden = true;
  pastSection.dataset.archiveState = "";
  archiveDetail.hidden = true;
  archiveDetail.replaceChildren();
  collectionGrid.replaceChildren();
  uploadLayer.replaceChildren();
  collageLayer.replaceChildren();
  ransomNote.replaceChildren();
  resetPostcardPreviewClasses();
  setCardsReadOnly(false);
  replacePanel.hidden = true;
  root.classList.remove("lucky-active", "preview-focus-postcard", "preview-lucky-ransom");
  exportArchiveButton.textContent = "导出归档";
  state = {
    ...createInitialState(),
    date: getTodayKey(),
    lucky: { active: false, selectedElementId: null },
    uploads: [],
  };
  activeThemePrompt = "dreamy-memory";
  themeAttempt = 0;
  activeRansomPhrase = "wish you were here";
  setPostcardClasses();
}

function setPreviewPostcards({ aFlipped = false, bFlipped = false, aArchived = false, bArchived = false } = {}) {
  state = {
    ...state,
    postcards: {
      ...state.postcards,
      a: {
        ...state.postcards.a,
        flipped: aFlipped,
        archived: aArchived,
      },
      b: {
        ...state.postcards.b,
        flipped: bFlipped,
        archived: bArchived,
      },
    },
  };
  setPostcardClasses();
}

function renderPreviewHeroBase() {
  renderHeroCollage();
  renderRansomPhrase(activeRansomPhrase);
  setPostcardClasses();
}

function renderPreviewArchiveBase() {
  root.hidden = true;
  pastSection.hidden = false;
  pastSection.scrollIntoView({ behavior: "auto", block: "start" });
}

function renderPreviewArchiveBatch(selectedIndex = -1) {
  renderPreviewArchiveBase();
  const cards = buildPastCollectionCards(createPreviewArchiveEntries());
  renderArchiveBatch(cards, selectedIndex);
  if (selectedIndex >= 0) {
    renderArchiveDetail(cards[selectedIndex]);
  }
}

function renderDesignPreviewState(stateId) {
  resetPreviewShell(stateId);

  if (stateId === "postcard-front") {
    root.classList.add("preview-focus-postcard");
    renderPreviewHeroBase();
    setPreviewPostcards();
  } else if (stateId === "postcard-back") {
    root.classList.add("preview-focus-postcard");
    renderPreviewHeroBase();
    setPreviewPostcards({ aFlipped: true, bFlipped: true });
  } else if (stateId === "one-stamped-waiting") {
    renderPreviewHeroBase();
    setPreviewPostcards({ aFlipped: true, bFlipped: true, aArchived: true });
    setPostcardCover("b", true);
    setCardsReadOnly(true);
  } else if (stateId === "both-stamped-ready") {
    renderPreviewHeroBase();
    setPreviewPostcards({ aFlipped: true, bFlipped: true, aArchived: true, bArchived: true });
    setPostcardCover("a", true);
    setPostcardCover("b", true);
    document.querySelector(".postcard-stage")?.classList.add("is-ready-reveal");
    setCardsReadOnly(true);
  } else if (stateId === "revealed") {
    renderPreviewHeroBase();
    setPreviewPostcards({ aFlipped: true, bFlipped: true, aArchived: true, bArchived: true });
    document.querySelector(".postcard-stage")?.classList.add("is-revealed");
    postcardEls.forEach((card) => card.classList.add("is-demo-revealed"));
    setCardsReadOnly(true);
  } else if (stateId === "archive-empty") {
    renderPreviewArchiveBase();
    renderArchiveEmpty();
  } else if (stateId === "archive-batch") {
    renderPreviewArchiveBatch();
  } else if (stateId === "archive-selected") {
    renderPreviewArchiveBatch(2);
  } else if (stateId === "lucky-ransom") {
    root.classList.add("preview-lucky-ransom");
    renderPreviewHeroBase();
    renderRansomPhrase("one more question", 2);
  } else if (stateId === "upload-one") {
    state = {
      ...state,
      uploads: [mockUploads[0]],
    };
    renderPreviewHeroBase();
  } else if (stateId === "upload-two") {
    state = {
      ...state,
      uploads: [...mockUploads],
    };
    renderPreviewHeroBase();
  } else if (stateId === "export-archive") {
    renderPreviewArchiveBatch();
    pastSection.dataset.archiveState = "export";
    exportArchiveButton.textContent = "导出预览";
  } else {
    renderPreviewHeroBase();
    setPreviewPostcards();
  }

  document.querySelectorAll(".design-preview-panel [data-preview-state]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.previewState === stateId);
  });
}

function installDesignPreviewPanel() {
  const panel = document.createElement("nav");
  panel.className = "design-preview-panel";
  panel.setAttribute("aria-label", "Design Preview 状态切换");
  const title = document.createElement("strong");
  title.textContent = "Design Preview";
  panel.append(title);
  PREVIEW_STATES.forEach((previewState) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = previewState.label;
    button.dataset.previewState = previewState.id;
    button.addEventListener("click", () => renderDesignPreviewState(previewState.id));
    panel.append(button);
  });
  document.body.append(panel);
  renderDesignPreviewState(PREVIEW_STATES[0].id);
}

if (isPreviewMode) {
  installDesignPreviewPanel();
} else {
  renderHeroCollage();
  setPostcardClasses();
}
