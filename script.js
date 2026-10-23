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
  document.documentElement.classList.remove("theme-transitioning");
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
  themeRippleCover?.style.removeProperty("clip-path");
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

  if (!themeDropSvg?.animate) {
    update();
    return;
  }

  themeAnimationBusy = true;
  const run = ++themeAnimationRun;
  const toggleRect = themeToggle?.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const x = toggleRect ? toggleRect.left + toggleRect.width / 2 : viewportWidth / 2;
  const dropStartY = toggleRect ? toggleRect.bottom - 4 : 42;
  const y = Math.min(Math.max(viewportHeight * 0.40, dropStartY + 180), viewportHeight - 60);
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

  // Step 1: Droplet forms under the toggle button
  const dropToButton = registerAnimation(themeDropSvg, [
    { transform: `${move(dropStartY)} scale(0.2)`, opacity: 0 },
    { transform: `${move(dropStartY + 4)} scale(0.8, 0.7)`, opacity: 0.95, offset: 0.4 },
    { transform: `${move(dropStartY + 10)} scale(1.08, 0.94)`, opacity: 1, offset: 0.75 },
    { transform: `${move(dropStartY + 14)} scale(1)`, opacity: 1 }
  ], { duration: 280, easing: "cubic-bezier(0.25, 0, 0.3, 1)", fill: "forwards" });

  if (!await waitForAnimation(dropToButton) || run !== themeAnimationRun) {
    if (run === themeAnimationRun) {
      clearThemeAnimation();
    }
    return;
  }

  // Step 2: Droplet accelerates downward under gravity toward the waterline
  const impactOffset = y - 42;
  const fallDistance = Math.max(60, impactOffset - dropStartY);
  const fallDuration = Math.max(340, Math.min(480, Math.sqrt(fallDistance) * 24));
  themeDropSvg.style.transformOrigin = "50% 100%";
  const dropToWater = registerAnimation(themeDropSvg, [
    { transform: `${move(dropStartY + 14)} scale(1, 1.05)` },
    { transform: `${move(dropStartY + 35)} scale(0.92, 1.16)`, offset: 0.18 },
    { transform: `${move(impactOffset)} scale(0.96, 1.12)` }
  ], { duration: fallDuration, easing: "cubic-bezier(0.33, 0, 0.67, 0.33)", fill: "forwards" });

  if (!await waitForAnimation(dropToWater) || run !== themeAnimationRun) {
    if (run === themeAnimationRun) {
      clearThemeAnimation();
    }
    return;
  }

  // Step 3: THE MOMENT OF IMPACT
  // Immediately start the atmospheric theme shift with smooth transitions!
  document.documentElement.classList.add("theme-transitioning");
  update();

  // Droplet flattens into the water surface and dissipates
  registerAnimation(themeDropSvg, [
    { transform: `${move(impactOffset)} scale(0.96, 1.12)`, opacity: 1 },
    { transform: `${move(impactOffset + 4)} scale(2.0, 0.16)`, opacity: 0 }
  ], { duration: 160, easing: "cubic-bezier(0.15, 0.6, 0.4, 1)", fill: "forwards" });

  // Water ripple ring and water flow lines start flowing
  themeWaterFlow?.classList.add("is-flowing");
  themeWaterRipple?.classList.add("is-flowing");

  // Rebound bead pops up and settles back
  registerAnimation(themeDropBead, [
    { transform: "translate(-50%, 0) scale(1)", opacity: 0.9 },
    { transform: "translate(-50%, -42px) scale(0.75)", opacity: 0.9, offset: 0.48 },
    { transform: "translate(-50%, 6px) scale(0.4)", opacity: 0 }
  ], { delay: 60, duration: 460, easing: "cubic-bezier(0.2, 0.8, 0.4, 1)", fill: "both" });

  // Splash droplets arc outward
  const splashSpecs = [
    { dx: -38, rise: 22, size: 5, duration: 480 },
    { dx: -22, rise: 32, size: 6, duration: 530 },
    { dx: -9, rise: 38, size: 5, duration: 570 },
    { dx: 9, rise: 36, size: 6, duration: 550 },
    { dx: 24, rise: 28, size: 5, duration: 510 },
    { dx: 38, rise: 18, size: 4, duration: 460 }
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
      { transform: "translateY(6px) scale(0.35)", opacity: 0 }
    ], { duration, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)", fill: "both" });
  });

  // Birds glide across the open sky (positioned inside visible area, soaring leftward)
  const birdPlans = [
    { offsetX: -60, offsetY: -105, dx: -240, dy: -36, duration: 1100, delay: 20, scale: 0.85 },
    { offsetX: -125, offsetY: -145, dx: -280, dy: -48, duration: 1200, delay: 90, scale: 0.65 },
    { offsetX: -25, offsetY: -75, dx: -200, dy: -24, duration: 1000, delay: 140, scale: 0.50 }
  ];

  themeBirds.forEach((bird, index) => {
    const plan = birdPlans[index];
    bird.style.left = `${Math.min(viewportWidth - 50, Math.max(120, x + plan.offsetX))}px`;
    bird.style.top = `${Math.max(65, y + plan.offsetY)}px`;
    registerAnimation(bird, [
      { transform: `translate(0, 10px) scale(${plan.scale})`, opacity: 0 },
      { transform: `translate(${plan.dx * 0.35}px, ${plan.dy * 0.3}px) scale(${plan.scale})`, opacity: 0.85, offset: 0.25 },
      { transform: `translate(${plan.dx}px, ${plan.dy}px) scale(${plan.scale * 0.88})`, opacity: 0 }
    ], { duration: plan.duration, delay: plan.delay, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "both" });
  });

  // Water shimmer wave radiating from the impact point
  themeRippleCover.style.opacity = "1";
  registerAnimation(themeRippleCover, [
    { clipPath: `ellipse(0px 0px at ${rippleX} ${rippleY})`, opacity: 0.95 },
    { clipPath: `ellipse(${rippleRx} ${rippleRy} at ${rippleX} ${rippleY})`, opacity: 0 }
  ], { duration: 800, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });

  // Clean finish once the ripple and palette transition settle
  window.setTimeout(() => {
    if (run === themeAnimationRun) {
      clearThemeAnimation();
    }
  }, 950);
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

const habitatTabs = Array.from(document.querySelectorAll(".habitat-tab"));

habitatTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const habitat = tab.dataset.habitat;
    if (heroArt) heroArt.dataset.habitat = habitat;
    if (habitatNote) habitatNote.textContent = habitatNotes[habitat];
    habitatTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
  });

  tab.addEventListener("keydown", (event) => {
    let targetIndex = index;
    if (event.key === "ArrowRight") {
      targetIndex = (index + 1) % habitatTabs.length;
    } else if (event.key === "ArrowLeft") {
      targetIndex = (index - 1 + habitatTabs.length) % habitatTabs.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = habitatTabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    habitatTabs[targetIndex].click();
    habitatTabs[targetIndex].focus();
  });
});

/* ── Scroll-driven: fixed header, reading progress, scroll spy ── */

const siteHeader = document.querySelector(".site-header");
const readingProgress = document.querySelector(".reading-progress");
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let lastScrollY = 0;
let ticking = false;

const onScroll = () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      // 1. Sticky header glass effect
      if (siteHeader) {
        siteHeader.classList.toggle("is-scrolled", lastScrollY > 60);
      }

      // 2. Reading progress bar
      if (readingProgress) {
        const docHeight = document.documentElement.scrollHeight;
        const viewHeight = window.innerHeight;
        const progress = Math.min(lastScrollY / (docHeight - viewHeight), 1) * 100;
        readingProgress.style.width = `${progress}%`;
      }

      // 3. Scroll spy — highlight current section
      let current = "";
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= 120) {
          current = sections[i].id;
          break;
        }
      }
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
      });

      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll(); // set initial state

/* ── Hero facts stagger entrance ── */

const heroFacts = document.querySelector(".hero-facts");
if (heroFacts) {
  const factsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  factsObserver.observe(heroFacts);
}

/* ── Reveal-on-scroll with stagger for sibling groups ── */

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const staggerParents = new Map();

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const parent = el.parentElement;

        // Stagger siblings revealed in the same parent
        if (!staggerParents.has(parent)) {
          staggerParents.set(parent, 0);
        }
        const index = staggerParents.get(parent);
        staggerParents.set(parent, index + 1);

        el.style.transitionDelay = `${index * 80}ms`;
        el.classList.add("is-visible");
        currentObserver.unobserve(el);

        // Clean up the delay after animation
        setTimeout(() => {
          el.style.transitionDelay = "";
        }, 650 + index * 80 + 50);
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

const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}
