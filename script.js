const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll("[data-reveal]");
const leadForm = document.querySelector("#leadForm");
const whatsappBaseUrl = "https://wa.me/5541996713782";
const interactivePanels = document.querySelectorAll(
  ".hero-window, .floating-card, .feature-card, .audience-card, .reason, .offer-panel, .lead-form, .telegram-spotlight, .deliverables-grid article, .lead-highlights article, .faq-list details"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (!prefersReducedMotion) {
  let cursorFrame = null;
  let nextX = window.innerWidth / 2;
  let nextY = window.innerHeight * 0.28;

  const syncCursorGlow = () => {
    document.documentElement.style.setProperty("--cursor-x", `${nextX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${nextY}px`);
    cursorFrame = null;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(syncCursorGlow);
    },
    { passive: true }
  );
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const enableInteractivePanel = (panel) => {
  panel.setAttribute("data-tilt", "");

  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    panel.style.setProperty("--mx", `${x}px`);
    panel.style.setProperty("--my", `${y}px`);
    panel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.removeProperty("--mx");
    panel.style.removeProperty("--my");
    panel.style.removeProperty("transform");
  });
};

if (!prefersReducedMotion) {
  interactivePanels.forEach(enableInteractivePanel);
}

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get("name") || "").trim();
    const stage = String(formData.get("stage") || "").trim();
    const goal = String(formData.get("goal") || "").trim();

    const message = [
      "Ol\u00e1! Quero criar minha ag\u00eancia digital.",
      "",
      `Nome: ${name}`,
      `Momento: ${stage}`,
      `Objetivo: ${goal}`,
    ].join("\n");

    const shareUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  });
}
