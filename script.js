const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

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

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme, true);
  document.body.classList.remove("theme-changing");
  requestAnimationFrame(() => document.body.classList.add("theme-changing"));
  window.setTimeout(() => document.body.classList.remove("theme-changing"), 760);
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
    const email = "jannatulnayeem0723@gmail.com";
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
