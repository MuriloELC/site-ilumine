(function () {
  const list = document.querySelector("[data-catalog-list]");
  const search = document.querySelector("[data-catalog-search]");
  const category = document.querySelector("[data-catalog-category]");
  const count = document.querySelector("[data-catalog-count]");
  let products = [];

  if (!list || !search || !category || !count) {
    return;
  }

  function createTagList(items) {
    const tagList = document.createElement("ul");
    tagList.className = "tag-list";

    items.forEach((item) => {
      const tag = document.createElement("li");
      tag.textContent = item;
      tagList.append(tag);
    });

    return tagList;
  }

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card is-missing-image";

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

    const productCategory = document.createElement("span");
    productCategory.className = "product-category";
    productCategory.textContent = product.categoria;

    const title = document.createElement("h3");
    title.textContent = product.nome;

    const description = document.createElement("p");
    description.textContent = product.descricao;

    const applicationsLabel = document.createElement("strong");
    applicationsLabel.textContent = "Aplicações";

    const highlightsLabel = document.createElement("strong");
    highlightsLabel.textContent = "Destaques";

    const button = document.createElement("a");
    button.className = "button button-primary";
    button.href = window.Ilumine.buildWhatsAppUrl(window.Ilumine.budgetMessage(product.nome));
    button.target = "_blank";
    button.rel = "noopener";
    button.textContent = "Solicitar orçamento";

    body.append(
      productCategory,
      title,
      description,
      applicationsLabel,
      createTagList(product.aplicacoes),
      highlightsLabel,
      createTagList(product.destaques)
    );

    body.append(button);
    card.append(media, body);

    return card;
  }

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getSearchText(product) {
    return normalize(
      [
        product.nome,
        product.categoria,
        product.descricao,
        product.fonte,
        ...product.aplicacoes,
        ...product.destaques,
        ...(product.referencias || []),
      ].join(" ")
    );
  }

  function render() {
    const query = normalize(search.value.trim());
    const selectedCategory = category.value;
    const filtered = products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
      const matchesSearch = !query || getSearchText(product).includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<p class="state-message">Nenhum produto encontrado com os filtros atuais.</p>';
    } else {
      list.replaceChildren(...filtered.map(createProductCard));
    }

    count.textContent =
      filtered.length === 1 ? "1 produto encontrado" : `${filtered.length} produtos encontrados`;
  }

  function setupCategories() {
    const categories = [...new Set(products.map((product) => product.categoria))].sort((a, b) =>
      a.localeCompare(b, "pt-BR")
    );

    categories.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      category.append(option);
    });
  }

  async function loadProducts() {
    try {
      const response = await fetch("assets/data/produtos.json");

      if (!response.ok) {
        throw new Error("Não foi possível carregar o catálogo.");
      }

      products = await response.json();
      setupCategories();
      render();
    } catch (error) {
      list.innerHTML =
        '<p class="state-message">Não foi possível carregar o catálogo. Rode o site em um servidor local para permitir o carregamento do JSON.</p>';
      count.textContent = "Catálogo indisponível";
    }
  }

  search.addEventListener("input", render);
  category.addEventListener("change", render);

  loadProducts();
})();
