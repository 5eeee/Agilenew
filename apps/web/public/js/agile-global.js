(function () {
  "use strict";

  var MODES = {
    services: { heroClass: "is-agile-mode-services", gridMode: "services" },
    products: { heroClass: "is-agile-mode-products", gridMode: "products" },
  };

  function getHero() {
    return document.querySelector(".hero");
  }

  function getWorksGrid() {
    return document.querySelector(".works-grid");
  }

  function getTitleLinks() {
    return {
      left: document.querySelector(".js-hero-title-linkleft"),
      right: document.querySelector(".js-hero-title-linkright"),
    };
  }

  function currentMode() {
    var links = getTitleLinks();
    if (links.right && links.right.classList.contains("active")) {
      return "products";
    }
    return "services";
  }

  function syncHeroPosters(mode) {
    var isProducts = mode === "products";
    document.querySelectorAll(".agile-hero-bg--services").forEach(function (el) {
      el.style.opacity = isProducts ? "0" : "1";
    });
    document.querySelectorAll(".agile-hero-bg--products").forEach(function (el) {
      el.style.opacity = isProducts ? "1" : "0";
    });
  }

  function setMode(mode, options) {
    options = options || {};
    var config = MODES[mode] || MODES.services;
    var hero = getHero();
    var grid = getWorksGrid();
    var links = getTitleLinks();

    if (hero) {
      hero.classList.remove("is-agile-mode-services", "is-agile-mode-products");
      hero.classList.add(config.heroClass);
    }

    if (grid) {
      grid.setAttribute("data-agile-mode", config.gridMode);
    }

    if (options.syncActive !== false && links.left && links.right) {
      if (mode === "products") {
        links.left.classList.remove("active");
        links.right.classList.add("active");
      } else {
        links.right.classList.remove("active");
        links.left.classList.add("active");
      }
    }

    syncHeroPosters(mode);
  }

  function unwrapSlideClips() {
    document.querySelectorAll(".hero-title .agile-slide-clip").forEach(function (clip) {
      var parent = clip.parentNode;
      if (!parent) return;
      while (clip.firstChild) {
        parent.insertBefore(clip.firstChild, clip);
      }
      clip.remove();
    });
    var title = document.querySelector(".hero-title");
    if (title) {
      title.classList.remove("agile-hero-title", "is-inview");
    }
  }

  function ensureHeroTitleVisible() {
    var inner = document.querySelector(".js-hero-title-inner");
    if (!inner) return;
    inner.style.transform = "none";
    inner.style.opacity = "1";
    inner.style.willChange = "auto";
    var title = document.querySelector(".hero-title");
    if (title) {
      title.style.overflow = "visible";
    }
  }

  /** Manner-like letter split for hover stagger if Pitcher SplitText is missing */
  function ensureMannerLikeChars(link) {
    if (!link || link.querySelector(".splittext-char, .agile-char")) {
      return;
    }
    var text = (link.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return;

    link.setAttribute("aria-label", text);
    link.textContent = "";
    link.classList.add("is-agile-char-split");

    var chars = Array.from(text);
    link.style.setProperty("--splittext-chars-length", String(chars.length));

    chars.forEach(function (ch, index) {
      var span = document.createElement("span");
      span.className = "agile-char splittext-char";
      span.textContent = ch === " " ? "\u00a0" : ch;
      span.style.setProperty("--splittext-char-index", String(index + 1));
      link.appendChild(span);
    });
  }

  function prepareTitleChars() {
    var links = getTitleLinks();
    ensureMannerLikeChars(links.left);
    ensureMannerLikeChars(links.right);
  }

  function bindTitleToggle() {
    var links = getTitleLinks();
    if (!links.left || !links.right || links.left.dataset.agileToggleBound === "1") {
      return;
    }

    links.left.dataset.agileToggleBound = "1";
    links.right.dataset.agileToggleBound = "1";

    function activate(link, event) {
      if (event) {
        if (event.type === "click") {
          event.preventDefault();
        }
        event.stopPropagation();
      }
      var mode = link.getAttribute("data-agile-mode") === "products" ? "products" : "services";
      setMode(mode);
    }

    [links.left, links.right].forEach(function (link) {
      ["mouseenter", "focus", "click"].forEach(function (name) {
        link.addEventListener(name, function (event) {
          activate(link, event);
        });
      });
    });

    setMode(currentMode(), { syncActive: true });
  }

  function ensureStaticHeroLayers(canvas) {
    if (!canvas || canvas.querySelector(".agile-hero-bg--services")) {
      return;
    }

    canvas.classList.add("agile-hero-canvas");

    var servicesBg = document.createElement("div");
    servicesBg.className =
      "agile-hero-bg agile-hero-bg--services hero-canvas__picture js-hero-posterleft";
    servicesBg.setAttribute("aria-hidden", "true");

    var productsBg = document.createElement("div");
    productsBg.className =
      "agile-hero-bg agile-hero-bg--products hero-canvas__picture js-hero-posterright";
    productsBg.setAttribute("aria-hidden", "true");

    canvas.insertBefore(servicesBg, canvas.firstChild);
    canvas.insertBefore(productsBg, servicesBg.nextSibling);
  }

  function forceStaticHero() {
    document.querySelectorAll(".hero-canvas").forEach(function (canvas) {
      ensureStaticHeroLayers(canvas);
      canvas.classList.add("is-webgl-error", "agile-hero-canvas");
      canvas.classList.remove("is-webgl-init");

      var webglCanvas = canvas.querySelector("canvas");
      if (webglCanvas) {
        webglCanvas.style.display = "none";
      }
    });
    syncHeroPosters(currentMode());
  }

  function cleanupCustomApproachJunk() {
    document
      .querySelectorAll(
        ".agile-methodology, .agile-approach-steps, .agile-approach-visual, .agile-charts-stage"
      )
      .forEach(function (node) {
        node.remove();
      });
  }

  function blockHeroWebGLOnly() {
    if (window.__agileHeroWebGLBlocked) {
      return;
    }
    window.__agileHeroWebGLBlocked = true;

    if (typeof WebGLRenderingContext === "undefined") {
      return;
    }

    var OriginalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (
        (type === "webgl" || type === "webgl2" || type === "experimental-webgl") &&
        this.closest &&
        this.closest(".hero-canvas")
      ) {
        return null;
      }
      return OriginalGetContext.apply(this, arguments);
    };
  }

  function clearNowebglHash() {
    if (location.hash === "#nowebgl") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function ensureScrollProgress() {
    if (document.querySelector(".agile-scroll-progress")) {
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "agile-scroll-progress";
    wrap.setAttribute("aria-hidden", "true");

    var bar = document.createElement("span");
    bar.className = "agile-scroll-progress__bar";
    wrap.appendChild(bar);
    document.body.appendChild(wrap);

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var progress = height > 0 ? Math.min(1, scrollTop / height) : 0;
      bar.style.width = progress * 100 + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  function observeStats() {
    var numbers = document.querySelectorAll(".clients-content__number");
    if (!numbers.length || !("IntersectionObserver" in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-agile-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    numbers.forEach(function (node) {
      observer.observe(node);
    });
  }

  function init() {
    document.documentElement.classList.add("is-agile-ready");
    clearNowebglHash();
    blockHeroWebGLOnly();
    unwrapSlideClips();
    forceStaticHero();
    cleanupCustomApproachJunk();
    ensureHeroTitleVisible();
    prepareTitleChars();
    bindTitleToggle();
    ensureScrollProgress();
    observeStats();

    // HeroTitle may wait for barba events that already fired — unstick after a beat
    setTimeout(ensureHeroTitleVisible, 400);
    setTimeout(prepareTitleChars, 700);
    setTimeout(bindTitleToggle, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("barba.afterEnter", init);
})();
