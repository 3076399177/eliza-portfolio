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

const isLocalOnlySource = (src) =>
  /^file:\/\//i.test(String(src || "")) && window.location.protocol.startsWith("http");

const renderLocalOnlyNotice = (target, item) => {
  const notice = document.createElement("div");
  notice.className = "preview-local-only";
  notice.innerHTML = `<strong>${item.title}</strong><span>该作品视频正在迁移至在线版本</span>`;
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
    { title: "海报设计合集", type: "image", src: "assets/works/poster-collection.webp" },
    { title: "产品品牌海报设计", type: "image", src: "assets/works/product-brand-poster.webp" },
    { title: "城市风格海报", type: "image", src: "assets/works/city-poster.webp" },
    { title: "Logo 与图形标志设计", type: "image", src: "assets/portfolio/logo-cover.webp" },
  ],
  editing: [
    { title: "精油广告短片", type: "video", src: "assets/works/essential-oil-ad.mp4", meta: "C4D 建模 · PR 合成 · DaVinci 调色" },
    { title: "滑屏卡点剪辑", type: "video", src: "assets/works/editing-slideshow-beat.mp4" },
    { title: "游戏界面转场", type: "video", src: "assets/works/editing-game-transition.mp4" },
    { title: "Vivo 产品剪辑", type: "video", src: "file:///F:/作品集整理/剪辑作品/vivo.mp4" },
    { title: "游戏主题混剪", type: "video", src: "file:///F:/作品集整理/剪辑作品/原神.mp4" },
    { title: "Omega 混剪", type: "video", src: "file:///F:/作品集整理/剪辑作品/Omega混剪.mp4" },
    { title: "TVC 调色练习", type: "video", src: "file:///F:/作品集整理/剪辑作品/TVC广告练习达芬奇.mp4" },
  ],
  ae: [
    { title: "手势跟踪特效", type: "video", src: "assets/works/ae-tracking.mp4" },
    { title: "烟花爆发展示", type: "video", src: "assets/works/ae-firework.mp4" },
    { title: "地球动效展示", type: "video", src: "assets/works/ae-earth.mp4" },
    { title: "房屋动效展示", type: "video", src: "file:///F:/作品集整理/AE特效/房子.mp4" },
    { title: "数字流特效", type: "video", src: "file:///F:/作品集整理/AE特效/数字流.mp4" },
  ],
  commercial: [
    { title: "商业广告短片", type: "video", src: "assets/works/commercial-candle.mp4" },
    { title: "文旅广告短片", type: "video", src: "assets/works/commercial-datong-travel.mp4" },
    { title: "防晒产品广告", type: "video", src: "file:///F:/作品集整理/广告/Mistine防晒棒1080p.mp4" },
  ],
  aiDrama: [
    { title: "猫咪综艺 先导片", type: "video", src: "assets/works/ai-drama-cat.mp4" },
    { title: "猫咪综艺 第一集", type: "video", src: "file:///F:/作品集整理/AI漫剧/猫咪综艺/猫猫第一集.mp4" },
    { title: "猫咪综艺 第二集", type: "video", src: "file:///F:/作品集整理/AI漫剧/猫咪综艺/猫vlog第二集（瑞）.mp4" },
    { title: "猫咪综艺 第七集", type: "video", src: "file:///F:/作品集整理/AI漫剧/猫咪综艺/猫猫第七集vlog.mp4" },
    { title: "猫咪综艺 第八集", type: "video", src: "file:///F:/作品集整理/AI漫剧/猫咪综艺/猫猫第八集vlog.mp4" },
    { title: "霸总穿越 第一集", type: "video", src: "file:///F:/作品集整理/AI漫剧/霸总穿越/霸总第1集（ct).mp4" },
    { title: "霸总穿越 第二集", type: "video", src: "file:///F:/作品集整理/AI漫剧/霸总穿越/霸总第2集（lyx）.mp4" },
    { title: "霸总穿越 第三集", type: "video", src: "file:///F:/作品集整理/AI漫剧/霸总穿越/霸总第3集（gy）.mp4" },
    { title: "青蛇 片段 09", type: "video", src: "file:///F:/作品集整理/AI漫剧/青蛇/青蛇-9（中英）（瑞.mp4" },
    { title: "青蛇 片段 11", type: "video", src: "file:///F:/作品集整理/AI漫剧/青蛇/青蛇-11（中英）（瑞）.mp4" },
    { title: "青蛇 片段 12", type: "video", src: "file:///F:/作品集整理/AI漫剧/青蛇/青蛇12（中英）（瑞）.mp4" },
    { title: "青蛇 片段 27", type: "video", src: "file:///F:/作品集整理/AI漫剧/青蛇/青蛇-27（中英）（瑞）.mp4" },
    { title: "青蛇 片段 28", type: "video", src: "assets/works/hosted/青蛇-28.mp4" },
    { title: "青蛇 片段 30", type: "video", src: "file:///F:/作品集整理/AI漫剧/青蛇/青蛇-30（中英）（瑞）.mp4" },
    { title: "Omega EP01", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/EP01.mp4" },
    { title: "Omega EP02", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/EP02.mp4" },
    { title: "Omega EP03", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/EP03.mp4" },
    { title: "Omega 片段 12", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-12（中英）（瑞）.mp4" },
    { title: "Omega 片段 16", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-16（中英）（瑞）.mp4" },
    { title: "Omega 片段 17", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-17（中英）（瑞）.mp4" },
    { title: "Omega 片段 40", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-40（中英）（瑞）.mp4" },
    { title: "Omega 片段 41", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-41（中英）（瑞）.mp4" },
    { title: "Omega 片段 42", type: "video", src: "file:///F:/作品集整理/AI漫剧/Omega/Omega-42（中英）（瑞）.mp4" },
    { title: "书烬先导片", type: "video", src: "file:///F:/作品集整理/AI漫剧/书烬/《书烬》先导片.mp4" },
    { title: "Last Signal", type: "video", src: "file:///F:/作品集整理/AI漫剧/last signal/7月11日.mp4" },
    { title: "菜市场 Vlog", type: "video", src: "file:///F:/作品集整理/AI漫剧/菜市场vlog.mp4" },
    { title: "恋爱综艺", type: "video", src: "file:///F:/作品集整理/AI漫剧/恋爱综艺.mp4" },
    { title: "末世系列", type: "video", src: "file:///F:/作品集整理/AI漫剧/末世系列/末世-11.mp4" },
    { title: "中秋主题短片", type: "video", src: "file:///F:/作品集整理/AI漫剧/中秋/最终.mp4" },
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
  { title: "海报合集封面", type: "image", src: "assets/works/featured-poster-mosaic.webp" },
  ...makeGraphicCollection(["海报 / 漫剧海报", "电影级海报", "海报 / 字体设计", "海报 / 美食餐饮海报", "西安文旅"], 20),
];

collections.brandPosterHighlights = [
  { title: "产品品牌海报合集", type: "image", src: "assets/works/featured-brand-mosaic.webp" },
  ...makeGraphicCollection(["产品品牌海报", "海报 / 产品品牌海报", "粉烧玻璃视觉方案"], 18),
];

collections.cityPosterHighlights = [
  { title: "城市视觉海报合集", type: "image", src: "assets/works/featured-city-mosaic.webp" },
  ...makeGraphicCollection(["城市风格海报", "海报 / 城市风格海报", "西安文旅"], 18),
];

collections.logoBrandHighlights = [
  { title: "Logo 与品牌系统封面", type: "image", src: "assets/works/featured-logo-mosaic.webp" },
  { title: "Dog Chef 品牌标志", type: "image", src: "assets/works/pdf-pages/page-04.webp" },
  { title: "Logo 设计方案", type: "image", src: "assets/works/pdf-pages/page-06.webp" },
  { title: "品牌辅助图形", type: "image", src: "assets/works/pdf-pages/page-07.webp" },
  { title: "品牌视觉延展", type: "image", src: "assets/works/pdf-pages/page-08.webp" },
  { title: "Logo 标志合集", type: "image", src: "assets/works/pdf-pages/page-18.webp" },
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
    name: "平面设计",
    desc: "海报、品牌视觉、字体版式、Logo 与宣传物料。",
    collection: "graphic",
  },
  {
    index: "02",
    name: "AI 漫剧",
    desc: "AI 影像叙事、角色短剧、系列化视频和故事剪辑。",
    collection: "aiDrama",
  },
  {
    index: "03",
    name: "剪辑与特效",
    desc: "节奏剪辑、界面转场、AE 动效、手势跟踪和视觉特效。",
    collection: "editing",
  },
  {
    index: "04",
    name: "商业广告",
    desc: "产品广告、文旅视频、商业短片与视觉包装。",
    collection: "commercial",
  },
];

let activeCategory = 0;

const openLibraryCategory = (collection) => {
  const categoryNames = {
    graphic: "平面设计",
    aiDrama: "AI漫剧",
    editing: "剪辑作品",
    commercial: "广告",
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
      if (isLocalOnlySource(item.src)) {
        renderLocalOnlyNotice(target, item);
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

  const openCollection = (collectionKey, title = "作品合集") => {
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
      openCollection(collectionKey, trigger.dataset.previewTitle || "作品合集");
      return;
    }

    const src = trigger.dataset.previewSrc;
    const type = trigger.dataset.previewType;
    const title = trigger.dataset.previewTitle || "作品预览";
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
    const graphicIndex = window.WORKS_LIBRARY.findIndex((item) => item.title === "平面设计");
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
        if (isLocalOnlySource(item.src)) {
          renderLocalOnlyNotice(previewBody, item);
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

    if (category.title === "平面设计") {
      const pdfEntry = category.groups
        .flatMap((group) => group.items)
        .find((item) => item.type === "pdf" && item.title.includes("作品集整理2026.3"));

      if (pdfEntry) {
        const pdfCard = document.createElement("button");
        pdfCard.type = "button";
        pdfCard.className = "library-pdf-feature";
        pdfCard.innerHTML = `
          <span>PDF Portfolio</span>
          <strong>作品集整理 2026.3</strong>
          <em>点击打开完整平面设计作品集 PDF</em>
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
      summary.innerHTML = `<span>${group.title}</span><span class="library-count">${group.items.length} 项</span>`;
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
          more.innerHTML = `<span>more</span><strong>继续显示 ${group.items.length - visibleCount} 项</strong>`;
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
