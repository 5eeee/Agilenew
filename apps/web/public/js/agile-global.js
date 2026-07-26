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

  function setMode(mode) {
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

    if (links.left && links.right) {
      if (mode === "products") {
        links.left.classList.remove("active");
        links.right.classList.add("active");
      } else {
        links.right.classList.remove("active");
        links.left.classList.add("active");
      }
    }
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
      title.classList.remove("agile-hero-title");
    }
  }

  function ensureMannerLikeChars(link) {
    if (!link) return;

    // Prefer Pitcher SplitText if already present
    if (link.querySelector(".splittext-char")) {
      var existing = link.querySelectorAll(".splittext-char");
      link.style.setProperty("--splittext-chars-length", String(existing.length));
      existing.forEach(function (node, index) {
        if (!node.style.getPropertyValue("--splittext-char-index")) {
          node.style.setProperty("--splittext-char-index", String(index + 1));
        }
      });
      return;
    }

    if (link.querySelector(".agile-char")) return;

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
        link.addEventListener(
          name,
          function (event) {
            activate(link, event);
          },
          true
        );
      });
    });

    setMode(currentMode());
  }

  function ensureParallaxHero(canvas) {
    if (!canvas) return;
    canvas.classList.add("agile-hero-canvas");
    canvas.querySelectorAll(".agile-parallax, .agile-topo-canvas").forEach(function (el) {
      el.remove();
    });
  }

  function ensureAgileHeroWord() {
    var inner = document.querySelector(".js-hero-title-inner");
    if (!inner) return;
    var title = document.querySelector(".hero-title");
    if (title) {
      title.classList.add("agile-hero-brand");
    }
    if (!inner.querySelector("[data-agile-cursor-fill]")) {
      inner.innerHTML =
        '<span class="agile-hero-word" data-agile-cursor-fill>' +
        '<span class="agile-hero-word__outline" aria-hidden="true">AGILE</span>' +
        '<span class="agile-hero-word__fill" aria-hidden="true">AGILE</span>' +
        '<span class="agile-hero-word__sr">AGILE</span>' +
        "</span>";
    }
  }

  function isMobileHero() {
    return window.matchMedia("(max-width: 767.98px), (hover: none) and (pointer: coarse)").matches;
  }

  function initCursorFill() {
    var word = document.querySelector("[data-agile-cursor-fill]");
    var hero = document.querySelector(".hero");
    if (!word || !hero || word.dataset.agileFillBound === "1") return;
    word.dataset.agileFillBound = "1";

    var radius = Math.max(180, Math.min(420, window.innerWidth * 0.22));

    function syncMobileMode() {
      if (isMobileHero()) {
        word.classList.add("is-agile-mobile-fill");
        word.style.removeProperty("--agile-fill-x");
        word.style.removeProperty("--agile-fill-y");
        word.style.removeProperty("--agile-fill-size");
      } else {
        word.classList.remove("is-agile-mobile-fill");
        word.style.setProperty("--agile-fill-size", "0px");
      }
    }

    function setPos(clientX, clientY, active) {
      var rect = word.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      word.classList.remove("is-agile-mobile-fill");
      var x = ((clientX - rect.left) / rect.width) * 100;
      var y = ((clientY - rect.top) / rect.height) * 100;
      var size = active
        ? isMobileHero()
          ? Math.max(120, Math.min(240, window.innerWidth * 0.42)) + "px"
          : radius + "px"
        : "0px";
      word.style.setProperty("--agile-fill-x", x.toFixed(2) + "%");
      word.style.setProperty("--agile-fill-y", y.toFixed(2) + "%");
      word.style.setProperty("--agile-fill-size", size);
    }

    syncMobileMode();

    hero.addEventListener(
      "mousemove",
      function (e) {
        if (isMobileHero()) return;
        setPos(e.clientX, e.clientY, true);
      },
      { passive: true }
    );

    hero.addEventListener(
      "mouseleave",
      function () {
        if (isMobileHero()) {
          syncMobileMode();
          return;
        }
        word.style.setProperty("--agile-fill-size", "0px");
      },
      { passive: true }
    );

    hero.addEventListener(
      "touchstart",
      function (e) {
        if (!e.touches || !e.touches[0]) return;
        setPos(e.touches[0].clientX, e.touches[0].clientY, true);
      },
      { passive: true }
    );

    hero.addEventListener(
      "touchmove",
      function (e) {
        if (!e.touches || !e.touches[0]) return;
        setPos(e.touches[0].clientX, e.touches[0].clientY, true);
      },
      { passive: true }
    );

    hero.addEventListener(
      "touchend",
      function () {
        window.setTimeout(syncMobileMode, 180);
      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      function () {
        radius = Math.max(180, Math.min(420, window.innerWidth * 0.22));
        syncMobileMode();
      },
      { passive: true }
    );
  }

  function forceStaticHero() {
    document.querySelectorAll(".hero-canvas").forEach(function (canvas) {
      ensureParallaxHero(canvas);
      canvas.classList.add("is-webgl-error", "agile-hero-canvas");
      canvas.classList.remove("is-webgl-init");
      var webglCanvas = canvas.querySelector("canvas");
      if (webglCanvas) {
        webglCanvas.style.display = "none";
      }
    });
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

  function paintHeaderAlways() {
    var header = document.querySelector(".header");
    if (header) {
      header.classList.add("is-agile-colored-header");
    }
  }

  function killHeaderIntro() {
    if (document.body) {
      document.body.classList.remove("is-header-intro-show", "is-header-intro-init");
    }

    document.querySelectorAll('[data-component="HeaderIntro"]').forEach(function (el) {
      el.removeAttribute("data-component");
    });

    document.querySelectorAll(".header-backdrop").forEach(function (el) {
      el.classList.add("fade");
      el.style.display = "none";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });

    document
      .querySelectorAll(
        ".header .js-header-link, .header .header-link__inner, .header__feedback, .header__burger, .header__logo, .header .logo"
      )
      .forEach(function (el) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.transform = "none";
      });

    var logo = document.querySelector(".js-header-logo");
    if (logo) {
      logo.classList.remove("logo--lg", "logo--sm", "logo--xs", "active");
      logo.classList.add("logo--text");
    }
  }

  function removeBrandText() {
    document.querySelectorAll(".agile-brand-text, .header .logo__text").forEach(function (el) {
      el.remove();
    });
  }

  function siteBase() {
    var publicPath = document.documentElement.getAttribute("data-public-path") || "";
    var match = publicPath.match(/^(.*?)\/assets\/front\/build\/?$/);
    return match && match[1] ? match[1] : "";
  }

  function ensureHeaderNav() {
    var inner = document.querySelector(".header__inner");
    if (!inner || inner.querySelector(".header__nav")) {
      return;
    }

    var feedback = inner.querySelector(".header__feedback");
    var nav = document.createElement("nav");
    nav.className = "header__nav";
    nav.setAttribute("aria-label", "Основное меню");
    var base = siteBase();

    var items = [
      { href: "/services", label: "Услуги" },
      { href: "/works", label: "Проекты" },
      { href: "/about", label: "О нас" },
      { href: "/awards", label: "Подход" },
      { href: "/contacts", label: "Контакты" },
    ];

    items.forEach(function (item) {
      var link = document.createElement("a");
      link.className = "header__nav-link";
      link.href = base + item.href;
      link.textContent = item.label;
      nav.appendChild(link);
    });

    if (feedback) {
      inner.insertBefore(nav, feedback);
    } else {
      inner.appendChild(nav);
    }
  }

  function init() {
    document.documentElement.classList.add("is-agile-ready", "is-agile-light");
    document.body.classList.add("is-agile-light");

    killHeaderIntro();
    removeBrandText();
    ensureHeaderNav();
    clearNowebglHash();
    blockHeroWebGLOnly();
    unwrapSlideClips();
    forceStaticHero();
    ensureAgileHeroWord();
    initCursorFill();
    cleanupCustomApproachJunk();
    ensureHeroTitleVisible();
    paintHeaderAlways();
    ensureScrollProgress();
    observeStats();

    setTimeout(killHeaderIntro, 200);
    setTimeout(ensureHeaderNav, 200);
    setTimeout(forceStaticHero, 200);
    setTimeout(ensureAgileHeroWord, 200);
    setTimeout(initCursorFill, 250);
    setTimeout(ensureHeroTitleVisible, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("barba.afterEnter", init);
  window.addEventListener("barba.afterOnce", killHeaderIntro);
})();
