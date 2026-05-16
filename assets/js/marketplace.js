(function () {
  const storageKey = "ilumine-marketplace-cart";
  const list = document.querySelector("[data-marketplace-list]");
  const search = document.querySelector("[data-marketplace-search]");
  const category = document.querySelector("[data-marketplace-category]");
  const count = document.querySelector("[data-marketplace-count]");
  const cartList = document.querySelector("[data-marketplace-cart-list]");
  const cartCount = document.querySelector("[data-marketplace-cart-count]");
  const cartTotal = document.querySelector("[data-marketplace-cart-total]");
  const sendLink = document.querySelector("[data-marketplace-send]");
  const clearButton = document.querySelector("[data-marketplace-clear]");
  let products = [];
  let cart = loadCart();

  if (!list || !search || !category || !count || !cartList || !cartCount || !cartTotal || !sendLink || !clearButton) {
    return;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => item && item.productId && Number(item.quantidade) > 0)
        .map((item) => ({
          productId: String(item.productId),
          nome: String(item.nome || ""),
          preco: Number(item.preco) || 0,
          quantidade: Math.max(1, Number(item.quantidade) || 1),
          unidade: String(item.unidade || "un"),
        }));
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }

  function getProductLimit(productId) {
    const product = products.find((item) => item.id === productId);

    if (!product || !Number.isFinite(Number(product.estoqueOpcional))) {
      return Infinity;
    }

    return Math.max(1, Number(product.estoqueOpcional));
  }

  function clampQuantity(value, productId) {
    const quantity = Math.max(1, Number(value) || 1);
    return Math.min(quantity, getProductLimit(productId));
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

  function createQuantityControl(initialValue, max) {
    const control = document.createElement("div");
    control.className = "quantity-control";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className = "quantity-button";
    decrease.setAttribute("aria-label", "Diminuir quantidade");
    decrease.textContent = "-";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.step = "1";
    input.value = String(initialValue);
    input.inputMode = "numeric";
    input.setAttribute("aria-label", "Quantidade");

    if (Number.isFinite(max)) {
      input.max = String(max);
    }

    const increase = document.createElement("button");
    increase.type = "button";
    increase.className = "quantity-button";
    increase.setAttribute("aria-label", "Aumentar quantidade");
    increase.textContent = "+";

    decrease.addEventListener("click", () => {
      input.value = String(Math.max(1, Number(input.value) - 1));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    increase.addEventListener("click", () => {
      const next = Number(input.value) + 1;
      input.value = String(Number.isFinite(max) ? Math.min(max, next) : next);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    control.append(decrease, input, increase);
    return { control, input };
  }

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card marketplace-card is-missing-image";

    const media = document.createElement("div");
    media.className = "product-media";

    const fallback = document.createElement("div");
    fallback.className = "product-fallback";
    fallback.textContent = product.nome.split(" ").slice(0, 2).join(" ");

    if (product.imagem) {
      const image = document.createElement("img");
      image.src = product.imagem;
      image.alt = product.nome;
      image.loading = "lazy";
      image.addEventListener("load", () => card.classList.remove("is-missing-image"));
      image.addEventListener("error", () => card.classList.add("is-missing-image"));
      media.append(image);
    }

    media.append(fallback);

    const body = document.createElement("div");
    body.className = "product-body";

    const productCategory = document.createElement("span");
    productCategory.className = "product-category";
    productCategory.textContent = product.categoria;

    const title = document.createElement("h3");
    title.textContent = product.nome;

    const description = document.createElement("p");
    description.textContent = product.descricao;

    const price = document.createElement("strong");
    price.className = "marketplace-price";
    price.textContent = `${formatCurrency(product.preco)} / ${product.unidade}`;

    const { control, input } = createQuantityControl(1, Number(product.estoqueOpcional));

    const button = document.createElement("button");
    button.className = "button button-primary";
    button.type = "button";
    button.textContent = "Adicionar ao carrinho";
    button.addEventListener("click", () => {
      addToCart(product, Number(input.value));
      input.value = "1";
    });

    body.append(
      productCategory,
      title,
      description,
      price,
      createTagList(product.destaques || []),
      control,
      button
    );
    card.append(media, body);

    return card;
  }

  function addToCart(product, quantity) {
    const existing = cart.find((item) => item.productId === product.id);
    const nextQuantity = clampQuantity((existing ? existing.quantidade : 0) + quantity, product.id);

    if (existing) {
      existing.quantidade = nextQuantity;
      existing.preco = Number(product.preco) || 0;
      existing.nome = product.nome;
      existing.unidade = product.unidade;
    } else {
      cart.push({
        productId: product.id,
        nome: product.nome,
        preco: Number(product.preco) || 0,
        quantidade: clampQuantity(quantity, product.id),
        unidade: product.unidade,
      });
    }

    saveCart();
    renderCart();
  }

  function updateCartItem(productId, quantity) {
    cart = cart.map((item) =>
      item.productId === productId ? { ...item, quantidade: clampQuantity(quantity, productId) } : item
    );
    saveCart();
    renderCart();
  }

  function removeCartItem(productId) {
    cart = cart.filter((item) => item.productId !== productId);
    saveCart();
    renderCart();
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  function getCartItemsCount() {
    return cart.reduce((total, item) => total + item.quantidade, 0);
  }

  function buildCartMessage() {
    const lines = cart.map((item) => {
      const subtotal = item.preco * item.quantidade;
      return `- ${item.quantidade} ${item.unidade}. ${item.nome} (${formatCurrency(item.preco)} cada) - ${formatCurrency(subtotal)}`;
    });

    return [
      "Olá, gostaria de solicitar um orçamento dos itens do Marketplace ILUMINE:",
      ...lines,
      `Total estimado: ${formatCurrency(getCartTotal())}.`,
      "Pode confirmar disponibilidade, prazo e condições de entrega?",
    ].join("\n");
  }

  function renderCart() {
    const totalItems = getCartItemsCount();
    cartCount.textContent = totalItems === 1 ? "1 item" : `${totalItems} itens`;
    cartTotal.textContent = formatCurrency(getCartTotal());

    if (cart.length === 0) {
      cartList.innerHTML = '<p class="state-message">Seu carrinho está vazio.</p>';
      sendLink.classList.add("is-disabled");
      sendLink.setAttribute("href", "#");
      sendLink.removeAttribute("target");
      sendLink.removeAttribute("rel");
      return;
    }

    const rows = cart.map((item) => {
      const row = document.createElement("article");
      row.className = "marketplace-cart-item";

      const info = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = item.nome;

      const meta = document.createElement("p");
      meta.textContent = `${formatCurrency(item.preco)} / ${item.unidade}`;

      info.append(title, meta);

      const { control, input } = createQuantityControl(item.quantidade, getProductLimit(item.productId));
      input.addEventListener("change", () => updateCartItem(item.productId, Number(input.value)));

      const subtotal = document.createElement("strong");
      subtotal.textContent = formatCurrency(item.preco * item.quantidade);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "marketplace-remove";
      remove.textContent = "Remover";
      remove.addEventListener("click", () => removeCartItem(item.productId));

      row.append(info, control, subtotal, remove);
      return row;
    });

    cartList.replaceChildren(...rows);
    sendLink.classList.remove("is-disabled");
    sendLink.href = window.Ilumine.buildWhatsAppUrl(buildCartMessage());
    sendLink.target = "_blank";
    sendLink.rel = "noopener";
  }

  function getSearchText(product) {
    return normalize([product.nome, product.categoria, product.descricao, ...(product.destaques || [])].join(" "));
  }

  function renderProducts() {
    const query = normalize(search.value.trim());
    const selectedCategory = category.value;
    const filtered = products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
      const matchesSearch = !query || getSearchText(product).includes(query);

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<p class="state-message">Nenhum item encontrado com os filtros atuais.</p>';
    } else {
      list.replaceChildren(...filtered.map(createProductCard));
    }

    count.textContent = filtered.length === 1 ? "1 item encontrado" : `${filtered.length} itens encontrados`;
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
      const response = await fetch("assets/data/marketplace-produtos.json");

      if (!response.ok) {
        throw new Error("Não foi possível carregar o marketplace.");
      }

      products = await response.json();
      setupCategories();
      renderProducts();
      renderCart();
    } catch (error) {
      list.innerHTML =
        '<p class="state-message">Não foi possível carregar o marketplace. Rode o site em um servidor local para permitir o carregamento do JSON.</p>';
      count.textContent = "Marketplace indisponível";
      renderCart();
    }
  }

  search.addEventListener("input", renderProducts);
  category.addEventListener("change", renderProducts);
  clearButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });

  loadProducts();
})();
