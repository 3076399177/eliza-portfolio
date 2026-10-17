class LiquidMetalLab {
  constructor({ container, src, title = "Liquid Metal Lab" }) {
    this.container = container;
    this.src = src;
    this.title = title;
    this.frame = null;
    this.loadPromise = null;
    this.handleMessage = this.handleMessage.bind(this);
  }

  static supportsWebGL() {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  }

  mount() {
    if (!this.container) return Promise.resolve(null);
    if (!LiquidMetalLab.supportsWebGL()) {
      this.container.innerHTML = `<div class="liquid-metal-fallback"><strong>WebGL 不可用</strong><span>请使用最新版 Chrome / Edge，并开启硬件加速。</span></div>`;
      return Promise.resolve(null);
    }
    if (this.frame) return this.loadPromise;

    this.container.innerHTML = "";
    this.frame = document.createElement("iframe");
    this.frame.className = "preview-iframe liquid-metal-frame";
    this.frame.title = this.title;
    this.frame.allow = "autoplay; microphone; fullscreen";
    this.frame.setAttribute("allowfullscreen", "");
    this.frame.loading = "lazy";
    this.frame.src = this.src;
    this.container.appendChild(this.frame);
    window.addEventListener("message", this.handleMessage);
    this.loadPromise = new Promise((resolve) => {
      this.frame.addEventListener("load", () => {
        this.container?.classList.add("is-ready");
        resolve(this.frame);
      }, { once: true });
    });
    return this.loadPromise;
  }

  async requestFullscreen() {
    const target = this.frame?.contentDocument?.documentElement || this.frame;
    if (!target?.requestFullscreen) return false;
    try {
      await target.requestFullscreen();
      return true;
    } catch {
      return false;
    }
  }

  handleMessage(event) {
    if (event.source !== this.frame?.contentWindow) return;
    if (event.data?.type === "liquid-metal-ready") this.container?.classList.add("is-ready");
  }

  unmount() {
    window.removeEventListener("message", this.handleMessage);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    if (this.frame) {
      this.frame.contentWindow?.postMessage({ type: "liquid-metal-dispose" }, "*");
      this.frame.src = "about:blank";
      this.frame.remove();
    }
    this.frame = null;
    this.loadPromise = null;
    this.container?.classList.remove("is-ready");
  }

  destroy() {
    this.unmount();
    this.container = null;
  }
}

window.LiquidMetalLab = LiquidMetalLab;
