const projects = [
  { id: "01", slug: "01-qr-code-component", title: "QR Code Component" },
  { id: "02", slug: "02-blog-preview-card", title: "Blog Preview Card" },
  { id: "03", slug: "03-social-links-profile", title: "Social Links Profile" },
  { id: "04", slug: "04-recipe-page", title: "Recipe Page" },
  { id: "05", slug: "05-product-preview-card-component", title: "Product Preview Card" },
  { id: "06", slug: "06-four-card-feature-section", title: "Four Card Feature Section" },
  { id: "07", slug: "07-testimonials-grid-section", title: "Testimonials Grid Section" },
  { id: "08", slug: "08-faq-accordion", title: "FAQ Accordion" },
  { id: "09", slug: "09-nft-preview-card-component", title: "NFT Preview Card" },
  { id: "10", slug: "10-results-summary-component", title: "Results Summary" },
  { id: "11", slug: "11-interactive-rating-component", title: "Interactive Rating" },
  { id: "12", slug: "12-newsletter-sign-up-with-success-message", title: "Newsletter Sign-up" },
  { id: "13", slug: "13-news-homepage", title: "News Homepage" },
  { id: "14", slug: "14-time-tracking-dashboard", title: "Time Tracking Dashboard" },
  { id: "15", slug: "15-sunnyside-agency-landing-page", title: "Sunnyside Agency Landing" },
  { id: "16", slug: "16-social-media-dashboard-with-theme-switcher", title: "Social Media Dashboard" },
  { id: "17", slug: "17-advice-generator-app", title: "Advice Generator App" },
  { id: "18", slug: "18-multi-step-form", title: "Multi-step Form" },
  { id: "19", slug: "19-blogr-landing-page", title: "Blogr Landing Page", status: "wip" },
  { id: "20", slug: "20-mortgage-repayment-calculator", title: "Mortgage Repayment Calculator", status: "wip" },
];

const grid = document.getElementById("project-grid");
const searchInput = document.getElementById("project-search");
const countEl = document.getElementById("project-count");
const emptyEl = document.getElementById("project-empty");

function projectPath(slug) {
  return `./${slug}/index.html`;
}

function previewPoster(slug) {
  if (slug === "20-mortgage-repayment-calculator") {
    return `./${slug}/preview.jpg`;
  }
  return `./${slug}/design/desktop-preview.jpg`;
}

function createCard(project) {
  const path = projectPath(project.slug);
  const article = document.createElement("article");
  article.className = "project-card";
  article.dataset.title = project.title.toLowerCase();
  article.dataset.id = project.id;

  const statusBadge =
    project.status === "wip"
      ? '<span class="project-card__badge">In progress</span>'
      : "";

  article.innerHTML = `
    <div class="project-card__preview" data-preview>
      <div class="project-card__preview-inner">
        <iframe
          title="Preview: ${project.title}"
          data-src="${path}"
          loading="lazy"
          tabindex="-1"
        ></iframe>
      </div>
      <img
        class="project-card__poster"
        src="${previewPoster(project.slug)}"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="project-card__body">
      <div class="project-card__meta">
        <span class="project-card__number">#${project.id}</span>
        ${statusBadge}
      </div>
      <h2 class="project-card__title">${project.title}</h2>
      <div class="project-card__actions">
        <a class="btn btn--primary" href="${path}">Open project</a>
        <a class="btn btn--ghost" href="${path}" target="_blank" rel="noopener noreferrer">New tab</a>
      </div>
    </div>
  `;

  const preview = article.querySelector("[data-preview]");
  preview.addEventListener("click", () => {
    window.location.href = path;
  });

  return article;
}

function renderProjects(filter = "") {
  const query = filter.trim().toLowerCase();
  grid.replaceChildren();
  let visible = 0;

  for (const project of projects) {
    const haystack = `${project.id} ${project.title} ${project.slug}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;

    grid.appendChild(createCard(project));
    visible += 1;
  }

  countEl.textContent = `${visible} of ${projects.length} projects`;
  emptyEl.hidden = visible > 0;
}

function loadIframe(iframe) {
  const src = iframe.dataset.src;
  if (!src || iframe.src) return;
  iframe.src = src;
  iframe.addEventListener(
    "load",
    () => {
      const poster = iframe.closest(".project-card__preview")?.querySelector(".project-card__poster");
      if (poster) poster.classList.add("is-hidden");
    },
    { once: true }
  );
}

function initLazyPreviews() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const iframe = entry.target.querySelector("iframe[data-src]");
        if (iframe) loadIframe(iframe);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "120px 0px", threshold: 0.01 }
  );

  grid.querySelectorAll(".project-card__preview").forEach((el) => observer.observe(el));
}

searchInput?.addEventListener("input", (e) => {
  renderProjects(e.target.value);
  initLazyPreviews();
});

renderProjects();
initLazyPreviews();
