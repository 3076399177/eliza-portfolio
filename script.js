const hero = document.querySelector(".hero");
const floatingName = document.querySelector(".floating-name");
const stickers = document.querySelectorAll(".sticker");
const typedStatement = document.querySelector(".text-type");
const stackContainer = document.querySelector(".stack-container");
const stackCards = Array.from(document.querySelectorAll(".stack-card"));
const categoryIndex = document.querySelector("#category-index");
const categoryName = document.querySelector("#category-name");
const categoryDesc = document.querySelector("#category-desc");
const glowCards = Array.from(document.querySelectorAll(".work-card"));
const lazyVideos = Array.from(document.querySelectorAll("video[data-src]"));
const previewModal = document.querySelector(".preview-modal");
const previewBody = document.querySelector(".preview-body");
const previewTitle = document.querySelector(".preview-title");
const previewClose = document.querySelector(".preview-close");
const previewFullscreen = document.querySelector(".preview-fullscreen");
let activeLiquidMetalLab = null;
const libraryTabs = document.querySelector(".library-tabs");
const libraryGroups = document.querySelector(".library-groups");

const normalizeSrc = (src) => {
  const fileMatch = /^file:\/\/\/([A-Za-z]):\/(.+)$/.exec(src);
  if (fileMatch && window.location.protocol.startsWith("http")) {
    const [, drive, filePath] = fileMatch;
    return `/external/${drive}/${encodeURI(decodeURI(filePath))}`;
  }

  try {
    return encodeURI(decodeURI(src));
  } catch {
    return encodeURI(src);
  }
};

const isUnavailableLocalSource = (src) =>
  /^file:\/\//i.test(String(src || "")) && window.location.protocol.startsWith("http");

const renderUnavailableVideo = (target, item) => {
  const notice = document.createElement("div");
  notice.className = "preview-unavailable";
  const label = document.createElement("strong");
  label.textContent = item.title || "Video work";
  const detail = document.createElement("span");
  detail.textContent = "This video is not available for online playback yet.";
  notice.append(label, detail);
  target.appendChild(notice);
};

const prepareVideo = (video) => {
  video.controls = true;
  video.autoplay = true;
  video.muted = true;
  video.preload = "metadata";
  video.playsInline = true;
  video.addEventListener("loadedmetadata", () => {
    video.play().catch(() => {});
  }, { once: true });
  return video;
};

const collections = {
  graphic: [
    { title: "娴锋姤璁捐鍚堥泦", type: "image", src: "assets/works/poster-collection.webp" },
    { title: "浜у搧鍝佺墝娴锋姤璁捐", type: "image", src: "assets/works/product-brand-poster.webp" },
    { title: "鍩庡競椋庢牸娴锋姤", type: "image", src: "assets/works/city-poster.webp" },
    { title: "Logo 涓庡浘褰㈡爣蹇楄璁?, type: "image", src: "assets/portfolio/logo-cover.webp" },
  ],
  editing: [
    { title: "绮炬补骞垮憡鐭墖", type: "video", src: "assets/works/essential-oil-ad.mp4", meta: "C4D 寤烘ā 路 PR 鍚堟垚 路 DaVinci 璋冭壊" },
    { title: "婊戝睆鍗＄偣鍓緫", type: "video", src: "assets/works/editing-slideshow-beat.mp4" },
    { title: "娓告垙鐣岄潰杞満", type: "video", src: "assets/works/editing-game-transition.mp4" },
    { title: "Vivo 浜у搧鍓緫", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?鍓緫浣滃搧/vivo.mp4" },
    { title: "娓告垙涓婚娣峰壀", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?鍓緫浣滃搧/鍘熺.mp4" },
    { title: "Omega 娣峰壀", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?鍓緫浣滃搧/Omega娣峰壀.mp4" },
    { title: "TVC 璋冭壊缁冧範", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?鍓緫浣滃搧/TVC骞垮憡缁冧範杈捐姮濂?mp4" },
  ],
  ae: [
    { title: "鎵嬪娍璺熻釜鐗规晥", type: "video", src: "assets/works/ae-tracking.mp4" },
    { title: "鐑熻姳鐖嗗彂灞曠ず", type: "video", src: "assets/works/ae-firework.mp4" },
    { title: "鍦扮悆鍔ㄦ晥灞曠ず", type: "video", src: "assets/works/ae-earth.mp4" },
    { title: "鎴垮眿鍔ㄦ晥灞曠ず", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AE鐗规晥/鎴垮瓙.mp4" },
    { title: "鏁板瓧娴佺壒鏁?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AE鐗规晥/鏁板瓧娴?mp4" },
  ],
  commercial: [
    { title: "鍟嗕笟骞垮憡鐭墖", type: "video", src: "assets/works/commercial-candle.mp4" },
    { title: "鏂囨梾骞垮憡鐭墖", type: "video", src: "assets/works/commercial-datong-travel.mp4" },
    { title: "闃叉檼浜у搧骞垮憡", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?骞垮憡/Mistine闃叉檼妫?080p.mp4" },
  ],
  aiDrama: [
    { title: "鐚挭缁艰壓 鍏堝鐗?, type: "video", src: "assets/works/ai-drama-cat.mp4" },
    { title: "鐚挭缁艰壓 绗竴闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鐚挭缁艰壓/鐚尗绗竴闆?mp4" },
    { title: "鐚挭缁艰壓 绗簩闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鐚挭缁艰壓/鐚玽log绗簩闆嗭紙鐟烇級.mp4" },
    { title: "鐚挭缁艰壓 绗竷闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鐚挭缁艰壓/鐚尗绗竷闆唙log.mp4" },
    { title: "鐚挭缁艰壓 绗叓闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鐚挭缁艰壓/鐚尗绗叓闆唙log.mp4" },
    { title: "闇告€荤┛瓒?绗竴闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闇告€荤┛瓒?闇告€荤1闆嗭紙ct).mp4" },
    { title: "闇告€荤┛瓒?绗簩闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闇告€荤┛瓒?闇告€荤2闆嗭紙lyx锛?mp4" },
    { title: "闇告€荤┛瓒?绗笁闆?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闇告€荤┛瓒?闇告€荤3闆嗭紙gy锛?mp4" },
    { title: "闈掕泧 鐗囨 09", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闈掕泧/闈掕泧-9锛堜腑鑻憋級锛堢憺.mp4" },
    { title: "闈掕泧 鐗囨 11", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闈掕泧/闈掕泧-11锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "闈掕泧 鐗囨 12", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闈掕泧/闈掕泧12锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "闈掕泧 鐗囨 27", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闈掕泧/闈掕泧-27锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "闈掕泧 鐗囨 28", type: "video", src: "assets/works/hosted/青蛇-28.mp4" },
    { title: "闈掕泧 鐗囨 30", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/闈掕泧/闈掕泧-30锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega EP01", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/EP01.mp4" },
    { title: "Omega EP02", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/EP02.mp4" },
    { title: "Omega EP03", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/EP03.mp4" },
    { title: "Omega 鐗囨 12", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-12锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega 鐗囨 16", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-16锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega 鐗囨 17", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-17锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega 鐗囨 40", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-40锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega 鐗囨 41", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-41锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "Omega 鐗囨 42", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/Omega/Omega-42锛堜腑鑻憋級锛堢憺锛?mp4" },
    { title: "涔︾儸鍏堝鐗?, type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/涔︾儸/銆婁功鐑€嬪厛瀵肩墖.mp4" },
    { title: "Last Signal", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/last signal/7鏈?1鏃?mp4" },
    { title: "鑿滃競鍦?Vlog", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鑿滃競鍦簐log.mp4" },
    { title: "鎭嬬埍缁艰壓", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鎭嬬埍缁艰壓.mp4" },
    { title: "鏈笘绯诲垪", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/鏈笘绯诲垪/鏈笘-11.mp4" },
    { title: "涓涓婚鐭墖", type: "video", src: "file:///F:/浣滃搧闆嗘暣鐞?AI婕墽/涓/鏈€缁?mp4" },
  ],
};

const makeGraphicCollection = (groupNames, limit = 18) => {
  if (!window.GRAPHIC_LIBRARY) return [];
  return window.GRAPHIC_LIBRARY.groups
    .filter((group) => groupNames.includes(group.title))
    .flatMap((group) => group.items.filter((item) => item.type === "image").slice(0, limit))
    .slice(0, limit);
};

collections.posterHighlights = [
  { title: "娴锋姤鍚堥泦灏侀潰", type: "image", src: "assets/works/featured-poster-mosaic.webp" },
  ...makeGraphicCollection(["娴锋姤 / 婕墽娴锋姤", "鐢靛奖绾ф捣鎶?, "娴锋姤 / 瀛椾綋璁捐", "娴锋姤 / 缇庨椁愰ギ娴锋姤", "瑗垮畨鏂囨梾"], 20),
];

collections.brandPosterHighlights = [
  { title: "浜у搧鍝佺墝娴锋姤鍚堥泦", type: "image", src: "assets/works/featured-brand-mosaic.webp" },
  ...makeGraphicCollection(["浜у搧鍝佺墝娴锋姤", "娴锋姤 / 浜у搧鍝佺墝娴锋姤", "绮夌儳鐜荤拑瑙嗚鏂规"], 18),
];

collections.cityPosterHighlights = [
  { title: "鍩庡競瑙嗚娴锋姤鍚堥泦", type: "image", src: "assets/works/featured-city-mosaic.webp" },
  ...makeGraphicCollection(["鍩庡競椋庢牸娴锋姤", "娴锋姤 / 鍩庡競椋庢牸娴锋姤", "瑗垮畨鏂囨梾"], 18),
];

collections.logoBrandHighlights = [
  { title: "Logo 涓庡搧鐗岀郴缁熷皝闈?, type: "image", src: "assets/works/featured-logo-mosaic.webp" },
  { title: "Dog Chef 鍝佺墝鏍囧織", type: "image", src: "assets/works/pdf-pages/page-04.webp" },
  { title: "Logo 璁捐鏂规", type: "image", src: "assets/works/pdf-pages/page-06.webp" },
  { title: "鍝佺墝杈呭姪鍥惧舰", type: "image", src: "assets/works/pdf-pages/page-07.webp" },
  { title: "鍝佺墝瑙嗚寤跺睍", type: "image", src: "assets/works/pdf-pages/page-08.webp" },
  { title: "Logo 鏍囧織鍚堥泦", type: "image", src: "assets/works/pdf-pages/page-18.webp" },
];

if (hero && floatingName) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const grainX = ((x + 0.5) * 100).toFixed(2);
    const grainY = ((y + 0.5) * 100).toFixed(2);

    floatingName.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
    hero.style.setProperty("--grain-x", `${grainX}%`);
    hero.style.setProperty("--grain-y", `${grainY}%`);

    stickers.forEach((sticker, index) => {
      const depth = (index % 5) + 1;
      sticker.style.marginLeft = `${x * depth * 8}px`;
      sticker.style.marginTop = `${y * depth * 8}px`;
    });
  });

  hero.addEventListener("pointerleave", () => {
    floatingName.style.transform = "";
    hero.style.setProperty("--grain-x", "50%");
    hero.style.setProperty("--grain-y", "50%");
    stickers.forEach((sticker) => {
      sticker.style.marginLeft = "";
      sticker.style.marginTop = "";
    });
  });
}

const revealItems = document.querySelectorAll(
  ".work-card, .category-copy, .stack-container, .timeline article, .skill-board div",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

if (typedStatement) {
  const content = typedStatement.querySelector(".text-type__content");
  const text = typedStatement.dataset.text || "";
  let index = 0;

  const typeNext = () => {
    if (!content || index > text.length) return;
    content.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(typeNext, 62);
    }
  };

  window.setTimeout(typeNext, 520);
}

const categoryData = [
  {
    index: "01",
    name: "骞抽潰璁捐",
    desc: "娴锋姤銆佸搧鐗岃瑙夈€佸瓧浣撶増寮忋€丩ogo 涓庡浼犵墿鏂欍€?,
    collection: "graphic",
  },
  {
    index: "02",
    name: "AI 婕墽",
    desc: "AI 褰卞儚鍙欎簨銆佽鑹茬煭鍓с€佺郴鍒楀寲瑙嗛鍜屾晠浜嬪壀杈戙€?,
    collection: "aiDrama",
  },
  {
    index: "03",
    name: "鍓緫涓庣壒鏁?,
    desc: "鑺傚鍓緫銆佺晫闈㈣浆鍦恒€丄E 鍔ㄦ晥銆佹墜鍔胯窡韪拰瑙嗚鐗规晥銆?,
    collection: "editing",
  },
  {
    index: "04",
    name: "鍟嗕笟骞垮憡",
    desc: "浜у搧骞垮憡銆佹枃鏃呰棰戙€佸晢涓氱煭鐗囦笌瑙嗚鍖呰銆?,
    collection: "commercial",
  },
];

let activeCategory = 0;

const openLibraryCategory = (collection) => {
  const categoryNames = {
    graphic: "骞抽潰璁捐",
    aiDrama: "AI婕墽",
    editing: "鍓緫浣滃搧",
    commercial: "骞垮憡",
  };

  document.querySelector("#library")?.scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => {
    const target = Array.from(document.querySelectorAll(".library-tabs button"))
      .find((button) => button.textContent === categoryNames[collection]);
    target?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }, 450);
};

const renderCategoryStack = () => {
  stackCards.forEach((card, index) => {
    const depth = (index - activeCategory + stackCards.length) % stackCards.length;
    card.dataset.depth = depth.toString();
    card.classList.toggle("is-top", depth === 0);
    card.setAttribute("aria-pressed", depth === 0 ? "true" : "false");
  });

  const current = categoryData[activeCategory];
  if (categoryIndex) categoryIndex.textContent = current.index;
  if (categoryName) categoryName.textContent = current.name;
  if (categoryDesc) categoryDesc.textContent = current.desc;
};

if (stackCards.length) {
  stackCards.forEach((card, index) => {
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (Number(card.dataset.depth) === 0) {
        openLibraryCategory(categoryData[activeCategory].collection);
        return;
      }

      activeCategory = index;
      renderCategoryStack();
    });
  });

  stackContainer?.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".stack-card");
    if (!clickedCard) return;

    const clickedIndex = Number(clickedCard.dataset.index);
    const clickedDepth = Number(clickedCard.dataset.depth);
    if (clickedDepth !== 0) {
      activeCategory = clickedIndex;
      renderCategoryStack();
      return;
    }

    const rect = clickedCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const isCenterHit = Math.abs(x - centerX) < rect.width * 0.28 && Math.abs(y - centerY) < rect.height * 0.28;

    if (isCenterHit) {
      openLibraryCategory(categoryData[activeCategory].collection);
    } else {
      activeCategory = (activeCategory + 1) % stackCards.length;
      renderCategoryStack();
    }
  });

  renderCategoryStack();
}

if (glowCards.length) {
  const getCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  };

  const getEdgeProximity = (el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100;
  };

  const getCursorAngle = (el, x, y) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    let degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  };

  glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--edge-proximity", getEdgeProximity(card, x, y).toFixed(3));
      card.style.setProperty("--cursor-angle", `${getCursorAngle(card, x, y).toFixed(3)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--edge-proximity", "0");
      card.style.setProperty("--cursor-angle", "45deg");
    });
  });
}

if (lazyVideos.length) {
  const loadVideo = (video) => {
    if (!video.dataset.src) return;
    video.src = video.dataset.src;
    video.removeAttribute("data-src");
    video.load();
  };

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (video.dataset.load === "hover") return;
        if (entry.isIntersecting) {
          loadVideo(video);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "240px 0px", threshold: 0.18 },
  );

  lazyVideos.forEach((video) => {
    const playOnDemand = () => {
      loadVideo(video);
      video.play().catch(() => {});
    };

    if (video.dataset.load === "hover") {
      video.addEventListener("pointerenter", playOnDemand, { once: true });
      video.addEventListener("click", playOnDemand, { once: true });
      return;
    }

    videoObserver.observe(video);
  });
}

if (previewModal && previewBody && previewTitle && previewClose) {
  const renderPreviewItem = (item, target) => {
    target.innerHTML = "";

    if (item.type === "video") {
      if (isUnavailableLocalSource(item.src)) {
        renderUnavailableVideo(target, item);
        return;
      }
      const video = document.createElement("video");
      video.src = normalizeSrc(item.src);
      prepareVideo(video);
      target.appendChild(video);
      video.play().catch(() => {});
    } else {
      const image = document.createElement("img");
      image.src = normalizeSrc(item.src);
      image.alt = item.title;
      target.appendChild(image);
    }

    if (item.meta) {
      const meta = document.createElement("p");
      meta.className = "preview-meta";
      meta.textContent = item.meta;
      target.appendChild(meta);
    }
  };

  const openCollection = (collectionKey, title = "浣滃搧鍚堥泦") => {
    const items = collections[collectionKey] || [];
    if (!items.length) return;

    previewBody.innerHTML = "";
    previewTitle.textContent = title;

    const layout = document.createElement("div");
    layout.className = "preview-layout";
    const list = document.createElement("div");
    list.className = "preview-playlist";
    const stage = document.createElement("div");
    stage.className = "preview-stage";

    items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.title;
      button.className = index === 0 ? "is-active" : "";
      button.addEventListener("click", () => {
        list.querySelectorAll("button").forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");
        renderPreviewItem(item, stage);
      });
      list.appendChild(button);
    });

    layout.append(list, stage);
    previewBody.appendChild(layout);
    renderPreviewItem(items[0], stage);

    previewModal.classList.add("is-open");
    previewModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const openPreview = (trigger) => {
    const collectionKey = trigger.dataset.collection;
    if (collectionKey) {
      openCollection(collectionKey, trigger.dataset.previewTitle || "浣滃搧鍚堥泦");
      return;
    }

    const src = trigger.dataset.previewSrc;
    const type = trigger.dataset.previewType;
    const title = trigger.dataset.previewTitle || "浣滃搧棰勮";
    if (!src || !type) return;

    previewBody.innerHTML = "";
    if (activeLiquidMetalLab) {
      activeLiquidMetalLab.destroy();
      activeLiquidMetalLab = null;
    }
    previewTitle.textContent = title;
    if (previewFullscreen) previewFullscreen.hidden = type !== "iframe";

    if (type === "iframe") {
      activeLiquidMetalLab = new window.LiquidMetalLab({
        container: previewBody,
        src: normalizeSrc(src),
        title,
      });
      activeLiquidMetalLab.mount();
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = normalizeSrc(src);
      prepareVideo(video);
      previewBody.appendChild(video);
      video.play().catch(() => {});
    } else {
      const image = document.createElement("img");
      image.src = normalizeSrc(src);
      image.alt = title;
      previewBody.appendChild(image);
    }

    previewModal.classList.add("is-open");
    previewModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    if (activeLiquidMetalLab) {
      activeLiquidMetalLab.destroy();
      activeLiquidMetalLab = null;
    }
    if (previewFullscreen) previewFullscreen.hidden = true;
    previewModal.classList.remove("is-open");
    previewModal.setAttribute("aria-hidden", "true");
    previewBody.innerHTML = "";
    document.body.style.overflow = "";
  };

  previewFullscreen?.addEventListener("click", async () => {
    if (activeLiquidMetalLab) {
      const entered = await activeLiquidMetalLab.requestFullscreen();
      if (!entered) await previewModal.requestFullscreen?.().catch(() => {});
    }
  });

  document.querySelectorAll("[data-preview-src], [data-collection]").forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", () => openPreview(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(item);
      }
    });
  });

  previewClose.addEventListener("click", closePreview);
  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) closePreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && previewModal.classList.contains("is-open")) {
      closePreview();
    }
  });

}

if (libraryTabs && libraryGroups && Array.isArray(window.WORKS_LIBRARY)) {
  let activeLibrary = 0;

  if (window.GRAPHIC_LIBRARY) {
    const graphicIndex = window.WORKS_LIBRARY.findIndex((item) => item.title === "骞抽潰璁捐");
    if (graphicIndex >= 0) {
      window.WORKS_LIBRARY[graphicIndex] = window.GRAPHIC_LIBRARY;
    }
  }

  const openLibraryItem = (item) => {
    if (item.type === "pdf") {
      window.open(normalizeSrc(item.src), "_blank", "noopener");
      return;
    }

    if (previewModal && previewBody && previewTitle) {
      previewBody.innerHTML = "";
      previewTitle.textContent = item.title;

      if (item.type === "video") {
        if (isUnavailableLocalSource(item.src)) {
          renderUnavailableVideo(previewBody, item);
          previewModal.classList.add("is-open");
          previewModal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          return;
        }
        const video = document.createElement("video");
        video.src = normalizeSrc(item.src);
        prepareVideo(video);
        previewBody.appendChild(video);
        video.play().catch(() => {});
      } else {
        const image = document.createElement("img");
        image.src = normalizeSrc(item.src);
        image.alt = item.title;
        previewBody.appendChild(image);
      }

      previewModal.classList.add("is-open");
      previewModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  };

  const renderLibrary = () => {
    const category = window.WORKS_LIBRARY[activeLibrary];
    libraryTabs.innerHTML = "";
    libraryGroups.innerHTML = "";

    window.WORKS_LIBRARY.forEach((item, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.textContent = item.title;
      tab.className = index === activeLibrary ? "is-active" : "";
      tab.addEventListener("click", () => {
        activeLibrary = index;
        renderLibrary();
      });
      libraryTabs.appendChild(tab);
    });

    if (category.title === "骞抽潰璁捐") {
      const pdfEntry = category.groups
        .flatMap((group) => group.items)
        .find((item) => item.type === "pdf" && item.title.includes("浣滃搧闆嗘暣鐞?026.3"));

      if (pdfEntry) {
        const pdfCard = document.createElement("button");
        pdfCard.type = "button";
        pdfCard.className = "library-pdf-feature";
        pdfCard.innerHTML = `
          <span>PDF Portfolio</span>
          <strong>浣滃搧闆嗘暣鐞?2026.3</strong>
          <em>鐐瑰嚮鎵撳紑瀹屾暣骞抽潰璁捐浣滃搧闆?PDF</em>
        `;
        pdfCard.addEventListener("click", () => openLibraryItem(pdfEntry));
        libraryGroups.appendChild(pdfCard);
      }
    }

    category.groups.forEach((group, index) => {
      const details = document.createElement("details");
      details.className = "library-group";
      details.open = index === 0;

      const summary = document.createElement("summary");
      summary.innerHTML = `<span>${group.title}</span><span class="library-count">${group.items.length} 椤?/span>`;
      details.appendChild(summary);

      const items = document.createElement("div");
      items.className = "library-items";

      let visibleCount = 24;
      const renderGroupItems = () => {
        items.innerHTML = "";

        group.items.slice(0, visibleCount).forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "library-item";

        if (item.type === "image") {
          const thumbnail = document.createElement("img");
          thumbnail.src = normalizeSrc(item.src);
          thumbnail.alt = "";
          thumbnail.loading = "lazy";
          thumbnail.decoding = "async";
          button.appendChild(thumbnail);
        } else {
          const mediaMark = document.createElement("span");
          mediaMark.className = "library-media-mark";
          mediaMark.textContent = item.type === "pdf" ? "PDF" : "VIDEO";
          button.appendChild(mediaMark);
        }

        const type = document.createElement("span");
        type.textContent = item.type;
        const title = document.createElement("strong");
        title.textContent = item.title;
        button.append(type, title);
        button.addEventListener("click", () => openLibraryItem(item));
        items.appendChild(button);
        });

        if (visibleCount < group.items.length) {
          const more = document.createElement("button");
          more.type = "button";
          more.className = "library-item library-more";
          more.innerHTML = `<span>more</span><strong>缁х画鏄剧ず ${group.items.length - visibleCount} 椤?/strong>`;
          more.addEventListener("click", () => {
            visibleCount += 24;
            renderGroupItems();
          });
          items.appendChild(more);
        }
      };

      renderGroupItems();

      details.appendChild(items);
      libraryGroups.appendChild(details);
    });
  };

  renderLibrary();
}

