const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeDrop = document.querySelector("[data-theme-drop]");
const themeDropSvg = themeDrop?.querySelector(".theme-drop");
const themeRippleCover = themeDrop?.querySelector(".theme-ripple-cover");
const themeDropBead = themeDrop?.querySelector(".theme-drop-bead");
const themeWaterFlow = themeDrop?.querySelector(".theme-water-flow");
const themeWaterRipple = themeDrop?.querySelector(".theme-water-ripple");
const themeBirds = [...(themeDrop?.querySelectorAll(".theme-bird") ?? [])];

const setTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = theme;
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "dark" ? "#081c17" : "#18352e");
  }

  if (persist) {
    try {
      localStorage.setItem("jn-theme", theme);
    } catch (error) {}
  }
};

setTheme(document.documentElement.dataset.theme || "light");

let themeAnimationRun = 0;
let themeAnimationBusy = false;
let themeAnimations = [];
let themeSplashDrops = [];

const clearThemeAnimation = () => {
  themeAnimationRun += 1;
  themeAnimationBusy = false;
  themeAnimations.forEach((animation) => animation.cancel());
  themeAnimations = [];
  themeSplashDrops.forEach((drop) => drop.remove());
  themeSplashDrops = [];
  document.documentElement.classList.remove("theme-rippling");
  document.body.classList.remove("theme-changing");
  themeDrop?.classList.remove("is-active");
  themeDrop?.classList.remove("is-fallback");
  themeDropSvg?.style.removeProperty("left");
  themeDropSvg?.style.removeProperty("top");
  themeDropSvg?.style.removeProperty("transform");
  themeDropSvg?.style.removeProperty("transform-origin");
  themeDropSvg?.style.removeProperty("opacity");
  themeDropBead?.style.removeProperty("left");
  themeDropBead?.style.removeProperty("top");
  themeRippleCover?.style.removeProperty("opacity");
  themeWaterFlow?.classList.remove("is-flowing");
  themeWaterRipple?.classList.remove("is-flowing");
  themeBirds.forEach((bird) => {
    bird.style.removeProperty("left");
    bird.style.removeProperty("top");
  });
};

const waitForAnimation = async (animation) => {
  try {
    await animation.finished;
    return true;
  } catch (error) {
    return false;
  }
};

const animateThemeChange = async (nextTheme) => {
  if (themeAnimationBusy) {
    return;
  }

  const update = () => setTheme(nextTheme, true);
  update();

  if (!themeDropSvg?.animate) {
    return;
  }

  themeAnimationBusy = true;
  const run = ++themeAnimationRun;
  const toggleRect = themeToggle?.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const x = toggleRect ? toggleRect.left + toggleRect.width / 2 : viewportWidth / 2;
  const dropStartY = toggleRect ? toggleRect.bottom - 8 : 42;
  const y = Math.min(Math.max(viewportHeight * 0.42, dropStartY + 180), viewportHeight - 60);
  const rippleRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y) / 0.55) + 40;
  const rippleX = `${x}px`;
  const rippleY = `${y}px`;
  const rippleRx = `${rippleRadius}px`;
  const rippleRy = `${rippleRadius * 0.55}px`;
  const root = document.documentElement;

  root.style.setProperty("--ripple-x", rippleX);
  root.style.setProperty("--ripple-y", rippleY);
  root.style.setProperty("--ripple-rx", rippleRx);
  root.style.setProperty("--ripple-ry", rippleRy);
  root.style.setProperty("--ripple-cover", nextTheme === "dark" ? "#081c17" : "#f1eadc");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    update();
    clearThemeAnimation();
    return;
  }

  const move = (offset) => `translate(-50%, ${offset}px)`;
  const registerAnimation = (element, keyframes, options) => {
    const animation = element.animate(keyframes, options);
    themeAnimations.push(animation);
    return animation;
  };

  themeDropSvg.style.left = rippleX;
  themeDropSvg.style.top = "0px";
  themeDropSvg.style.transformOrigin = "50% 0%";
  themeDropBead.style.left = rippleX;
  themeDropBead.style.top = `${y - 5}px`;
  themeDrop?.classList.add("is-active");
  document.body.classList.add("theme-changing");

  const birdPlans = [
    { offsetX: -150, offsetY: -90, dx: -150, dy: -32, duration: 980, delay: 30, scale: 0.82 },
    { offsetX: 56, offsetY: -128, dx: 166, dy: -48, duration: 1040, delay: 140, scale: 0.58 },
    { offsetX: -30, offsetY: -160, dx: 78, dy: -26, duration: 860, delay: 90, scale: 0.44 }
  ];

  themeBirds.forEach((bird, index) => {
    const plan = birdPlans[index];
    bird.style.left = `${x + plan.offsetX}px`;
    bird.style.top = `${Math.max(70, y + plan.offsetY)}px`;
    registerAnimation(bird, [
      { transform: `translate(0, 8px) scale(${plan.scale})`, opacity: 0 },
      { transform: `translate(${plan.dx * 0.35}px, ${plan.dy * 0.3}px) scale(${plan.scale})`, opacity: 0.78, offset: 0.22 },
      { transform: `translate(${plan.dx}px, ${plan.dy}px) scale(${plan.scale * 0.86})`, opacity: 0 }
    ], { duration: plan.duration, delay: plan.delay, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "both" });
  });

  const dropToButton = registerAnimation(themeDropSvg, [
    { transform: `${move(dropStartY)} scale(0.25)`, opacity: 0 },
    { transform: `${move(dropStartY)} scale(0.8, 0.66)`, opacity: 1, offset: 0.45 },
    { transform: `${move(dropStartY)} scale(1.06, 0.9)`, opacity: 1, offset: 0.75 },
    { transform: `${move(dropStartY)} scale(1)`, opacity: 1 }
  ], { duration: 340, easing: "cubic-bezier(0.25, 0, 0.3, 1)", fill: "forwards" });

  if (!await waitForAnimation(dropToButton) || run !== themeAnimationRun) {
    if (run === themeAnimationRun) {
      clearThemeAnimation();
    }
    return;
  }

  const impactOffset = y - 42;
  const fallDistance = Math.max(60, impactOffset - dropStartY);
  const fallDuration = Math.max(360, Math.sqrt(fallDistance) * 27);
  themeDropSvg.style.transformOrigin = "50% 100%";
  const dropToWater = registerAnimation(themeDropSvg, [
    { transform: `${move(dropStartY)} scale(1)` },
    { transform: `${move(dropStartY + 10)} scale(0.93, 1.12)`, offset: 0.14 },
    { transform: `${move(impactOffset)} scale(0.95, 1.1)` }
  ], { duration: fallDuration, easing: "cubic-bezier(0.33, 0, 0.67, 0.33)", fill: "forwards" });

  if (!await waitForAnimation(dropToWater) || run !== themeAnimationRun) {
    if (run === themeAnimationRun) {
      clearThemeAnimation();
    }
    return;
  }

  themeWaterFlow?.classList.add("is-flowing");
  themeWaterRipple?.classList.add("is-flowing");

  registerAnimation(themeDropSvg, [
    { transform: `${move(impactOffset)} scale(0.95, 1.1)`, opacity: 1 },
    { transform: `${move(impactOffset)} scale(1.9, 0.2)`, opacity: 0 }
  ], { duration: 170, easing: "cubic-bezier(0.15, 0.6, 0.4, 1)", fill: "forwards" });

  const splashSpecs = [
    { dx: -34, rise: 18, size: 4, duration: 500 },
    { dx: -20, rise: 26, size: 5, duration: 560 },
    { dx: -8, rise: 30, size: 4, duration: 600 },
    { dx: 9, rise: 28, size: 5, duration: 580 },
    { dx: 22, rise: 23, size: 4, duration: 540 },
    { dx: 35, rise: 16, size: 3, duration: 490 }
  ];

  splashSpecs.forEach(({ dx, rise, size, duration }) => {
    const splash = document.createElement("span");
    splash.className = "theme-splash-drop";
    splash.style.left = `${x - size / 2}px`;
    splash.style.top = `${y - size}px`;
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    splash.innerHTML = "<i></i>";
    themeDrop.append(splash);
    themeSplashDrops.push(splash);
    registerAnimation(splash, [
      { transform: "translateX(0)" },
      { transform: `translateX(${dx}px)` }
    ], { duration, easing: "linear", fill: "both" });
    registerAnimation(splash.firstElementChild, [
      { transform: "translateY(0) scale(1)", opacity: 0.95 },
      { transform: `translateY(${-rise}px) scale(0.8)`, opacity: 0.95, offset: 0.52 },
      { transform: "translateY(5px) scale(0.4)", opacity: 0 }
    ], { duration, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)", fill: "both" });
  });

  registerAnimation(themeDropBead, [
    { transform: "translate(-50%, 0) scale(1)", opacity: 0.9 },
    { transform: "translate(-50%, -46px) scale(0.7)", opacity: 0.9, offset: 0.5 },
    { transform: "translate(-50%, 4px) scale(0.45)", opacity: 0 }
  ], { delay: 90, duration: 480, easing: "cubic-bezier(0.2, 0.8, 0.4, 1)", fill: "both" });

  const startFallback = () => {
    root.classList.remove("theme-rippling");
    themeDrop.classList.add("is-fallback");
    themeRippleCover.style.opacity = "1";
    const coverAnimation = registerAnimation(themeRippleCover, [
      { clipPath: `ellipse(0 0 at ${rippleX} ${rippleY})` },
      { clipPath: `ellipse(${rippleRx} ${rippleRy} at ${rippleX} ${rippleY})` }
    ], { duration: 2200, easing: "cubic-bezier(0.12, 0.72, 0.28, 1)", fill: "both" });
    let fallbackFinished = false;
    const finishFallback = () => {
      if (fallbackFinished || run !== themeAnimationRun) {
        return;
      }
      fallbackFinished = true;
      clearThemeAnimation();
    };
    coverAnimation.finished.then(() => {
      finishFallback();
    }).catch(() => {});
    window.setTimeout(finishFallback, 2400);
  };

  startFallback();
};

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  animateThemeChange(nextTheme).catch(() => {
    setTheme(nextTheme, true);
    clearThemeAnimation();
  });
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const habitatNotes = {
  wetland: "Quiet water, moving margins, small signs of life.",
  canopy: "Shade, calls, layers of life above the line of sight.",
  edge: "Where habitats meet, the questions become visible."
};

const heroArt = document.querySelector(".hero-art");
const habitatNote = document.querySelector("#habitat-note");

document.querySelectorAll(".habitat-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const habitat = tab.dataset.habitat;
    heroArt.dataset.habitat = habitat;
    habitatNote.textContent = habitatNotes[habitat];
    document.querySelectorAll(".habitat-tab").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
  });
});

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const copyEmail = document.querySelector("[data-copy-email]");
const contactStatus = document.querySelector("[data-contact-status]");

if (copyEmail) {
  copyEmail.addEventListener("click", async () => {
    const email = "jannat.nay3m@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      contactStatus.textContent = "Email copied to clipboard.";
    } catch (error) {
      contactStatus.textContent = email;
    }
  });
}

document.querySelector("[data-placeholder-link]")?.addEventListener("click", (event) => {
  event.preventDefault();
  contactStatus.textContent = "Add the verified LinkedIn profile URL before publishing.";
});

const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}
