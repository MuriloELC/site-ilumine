(function () {
  const whatsappNumber = "5569981111902";

  function budgetMessage(productName) {
    if (productName) {
      return `Olá, tenho interesse no produto: ${productName}. Gostaria de solicitar um orçamento.`;
    }

    return "Olá, gostaria de solicitar um orçamento para iluminação, LED ou decoração.";
  }

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function setActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".site-nav a").forEach((link) => {
      const linkPage = link.getAttribute("href");
      link.classList.toggle("is-active", linkPage === currentPage);
    });
  }

  function setupMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-site-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function setupLogoFallback() {
    document.querySelectorAll("[data-logo]").forEach((logo) => {
      const hideLogo = () => logo.classList.add("is-hidden");

      if (logo.complete && logo.naturalWidth === 0) {
        hideLogo();
      }

      logo.addEventListener("error", hideLogo);
    });
  }

  function setupGeneralWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-general]").forEach((link) => {
      link.setAttribute("href", buildWhatsAppUrl(budgetMessage()));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });
  }

  function createCompactProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card compact is-missing-image";

    const media = document.createElement("div");
    media.className = "product-media";

    const image = document.createElement("img");
    image.src = product.imagem;
    image.alt = product.nome;
    image.loading = "lazy";
    image.addEventListener("load", () => card.classList.remove("is-missing-image"));
    image.addEventListener("error", () => card.classList.add("is-missing-image"));

    const fallback = document.createElement("div");
    fallback.className = "product-fallback";
    fallback.textContent = product.nome.split(" ").slice(0, 2).join(" ");

    media.append(image, fallback);

    const body = document.createElement("div");
    body.className = "product-body";

    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.categoria;

    const title = document.createElement("h3");
    title.textContent = product.nome;

    const description = document.createElement("p");
    description.textContent = product.descricao;

    const link = document.createElement("a");
    link.className = "button button-primary";
    link.href = buildWhatsAppUrl(budgetMessage(product.nome));
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Solicitar orçamento";

    body.append(category, title, description, link);
    card.append(media, body);

    return card;
  }

  async function setupFeaturedProducts() {
    const root = document.querySelector("[data-featured-products]");

    if (!root) {
      return;
    }

    try {
      const response = await fetch("assets/data/produtos.json");

      if (!response.ok) {
        throw new Error("Não foi possível carregar o catálogo.");
      }

      const products = await response.json();
      root.replaceChildren(...products.slice(0, 3).map(createCompactProductCard));
    } catch (error) {
      root.innerHTML =
        '<p class="state-message">Não foi possível carregar os produtos. Rode o site em um servidor local para habilitar o catálogo.</p>';
    }
  }

  function setupContactForm() {
    const form = document.querySelector("#contact-form");

    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const nome = String(formData.get("nome") || "").trim();
      const empresa = String(formData.get("empresa") || "").trim();
      const interesse = String(formData.get("interesse") || "").trim();
      const messageParts = [
        "Olá, gostaria de solicitar um orçamento para iluminação, LED ou decoração.",
        nome ? `Nome: ${nome}.` : "",
        empresa ? `Empresa: ${empresa}.` : "",
        interesse ? `Interesse: ${interesse}.` : "",
      ].filter(Boolean);

      window.open(buildWhatsAppUrl(messageParts.join(" ")), "_blank", "noopener");
    });
  }

  window.Ilumine = {
    whatsappNumber,
    budgetMessage,
    buildWhatsAppUrl,
  };

  setActiveNav();
  setupMobileNav();
  setupLogoFallback();
  setupGeneralWhatsAppLinks();
  setupFeaturedProducts();
  setupContactForm();
})();
