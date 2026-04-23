const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll("[data-reveal]");
const leadForm = document.querySelector("#leadForm");
const telegramBaseUrl = "https://t.me/+01LU4QabjOUzNTU5";
const interactivePanels = document.querySelectorAll(
  ".hero-window, .floating-card, .feature-card, .audience-card, .reason, .offer-panel, .lead-form, .faq-list details"
);

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

interactivePanels.forEach(enableInteractivePanel);

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get("name") || "").trim();
    const stage = String(formData.get("stage") || "").trim();
    const goal = String(formData.get("goal") || "").trim();

    const message = [
      "Ol\u00e1! Vim pela landing page do CAF\u00c9 Ag\u00eancias Digitais.",
      "",
      `Nome: ${name}`,
      `Momento: ${stage}`,
      `Objetivo: ${goal}`,
    ].join("\n");

    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(telegramBaseUrl)}&text=${encodeURIComponent(message)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  });
}
