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
  selectThemePack,
} from "./collageSystem.js";

let state = createInitialState();
let activeThemePrompt = "dreamy-memory";
let themeAttempt = 0;

const coupleId = "qqbb";
const questionId = "daily-question";
const root = document.querySelector(".scrapbook-hero");
const collageLayer = document.querySelector("[data-collage-layer]");
const postcardEls = [...document.querySelectorAll("[data-postcard]")];
const postcardFronts = [...document.querySelectorAll(".photo-frame[data-replaceable]")];
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
const archiveButtons = [...document.querySelectorAll("[data-archive-postcard]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function renderHeroCollage() {
  const themePrompt = themeAttempt > 0 ? `${activeThemePrompt} variant ${themeAttempt}` : activeThemePrompt;
  const items = createHeroComposition({
    coupleId,
    questionId,
    date: state.date,
    themePrompt,
    uploadedPhotos: state.uploads,
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
    front.dataset.photoTheme = photo?.themeId || "dreamy-memory";
    front.dataset.photoVariant = photo?.variant || "dream";
    front.style.setProperty("--accent-a", photo?.accents?.[0] || "#7b8c8f");
    front.style.setProperty("--accent-b", photo?.accents?.[1] || "#e2c77b");
    front.style.setProperty("--accent-c", photo?.accents?.[2] || "#24201b");
  });
}

function setPostcardClasses() {
  postcardEls.forEach((card) => {
    const id = card.dataset.postcard;
    card.classList.toggle("is-flipped", state.postcards[id].flipped);
    card.classList.toggle("is-archived", state.postcards[id].archived);
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
  setReplaceStatus("输入一个主题后，整张拼贴会用本地纸质元素重新组合。");
  replaceInput.focus();
}

luckyButton.addEventListener("click", () => {
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
  const pack = selectThemePack(activeThemePrompt);
  renderHeroCollage();
  setReplaceStatus(`已使用 ${pack.label} 的本地拼贴元素。`);
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

uploadButton.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", () => {
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
  button.style.setProperty("--fan", `${(index - 1) * 7}deg`);
  button.style.setProperty("--lift", `${index % 2 === 0 ? 0 : 18}px`);

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
  collectionGrid.replaceChildren();
  cards.forEach((card, index) => {
    collectionGrid.append(renderArchiveCard(card, index));
  });
}

openPastButton.addEventListener("click", () => {
  renderPastCollection();
  pastSection.hidden = false;
  pastSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
});

archiveButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
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

renderHeroCollage();
setPostcardClasses();
