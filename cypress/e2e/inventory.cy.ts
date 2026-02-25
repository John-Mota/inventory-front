describe("Inventory Management App E2E", () => {
  beforeEach(() => {
    // Intercept API calls using glob patterns to match the full backend URL
    cy.intercept("GET", "**/api/raw-materials", {
      body: [
        { id: "1", name: "Aço", stockQuantity: 100 },
        { id: "2", name: "Madeira", stockQuantity: 50 },
      ],
    }).as("getMaterials");

    cy.intercept("GET", "**/api/products", {
      body: [
        {
          id: "p1",
          name: "Mesa",
          value: 300,
          rawMaterials: [{ rawMaterialId: "2", requiredQuantity: 10 }],
        },
      ],
    }).as("getProducts");

    cy.intercept("GET", "**/api/production/suggestions", {
      body: [
        { productName: "Mesa", quantityToProduce: 5, totalValue: 1500 },
      ],
    }).as("getSuggestions");
  });

  // ── Dashboard ────────────────────────────────────────────────────
  it("should display the Dashboard with production suggestions", () => {
    cy.visit("/");
    cy.wait("@getSuggestions");
    cy.wait("@getMaterials");

    cy.contains("h1", "Painel").should("be.visible");
    cy.contains("Total de Produtos").should("be.visible");
    cy.contains("Receita Potencial Total").should("be.visible");
    cy.contains("Mesa").should("be.visible");
    cy.contains("R$").should("be.visible");
  });

  // ── Materials CRUD ───────────────────────────────────────────────
  it("should navigate to Materials page and see the list", () => {
    cy.visit("/");
    cy.contains("a", "Matérias-Primas").click();
    cy.url().should("include", "/materials");
    cy.wait("@getMaterials");

    cy.contains("Aço").should("be.visible");
    cy.contains("Madeira").should("be.visible");
    cy.contains("100").should("be.visible");
  });

  it("should create a new raw material via modal", () => {
    cy.intercept("POST", "**/api/raw-materials", {
      statusCode: 201,
      body: { id: "3", name: "Parafuso", stockQuantity: 500 },
    }).as("createMaterial");

    cy.visit("/materials");
    cy.wait("@getMaterials");

    // Open modal
    cy.contains("button", "Adicionar Material").click();
    cy.contains("Nova Matéria-Prima").should("be.visible");

    // Fill form
    cy.get("#material-name").type("Parafuso");
    cy.get("#stock-quantity").type("500");

    // Submit
    cy.contains("button", "Salvar").click();
    cy.wait("@createMaterial");

    // Success feedback
    cy.contains("Material salvo com sucesso").should("be.visible");
  });

  it("should open delete confirmation for a material", () => {
    cy.visit("/materials");
    cy.wait("@getMaterials");

    // Click the delete icon button (red trash) on the first row
    cy.get('button[title="Excluir Material"]').first().click();

    // Confirmation modal should appear
    cy.contains("Excluir Matéria-Prima").should("be.visible");
    cy.contains("Esta ação não pode ser desfeita").should("be.visible");

    // Cancel the deletion
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir Matéria-Prima").should("not.exist");
  });

  // ── Products CRUD ────────────────────────────────────────────────
  it("should navigate to Products page and see the list", () => {
    cy.visit("/");
    cy.contains("a", "Produtos").click();
    cy.url().should("include", "/products");
    cy.wait("@getProducts");

    cy.contains("Mesa").should("be.visible");
    cy.contains("R$").should("be.visible");
  });

  it("should open the view details modal for a product", () => {
    cy.visit("/products");
    cy.wait("@getProducts");
    cy.wait("@getMaterials");

    // Click the view icon button (blue eye) on the first row
    cy.get('button[title="Ver detalhes"]').first().click();

    // Modal should display product details
    cy.contains("Detalhes do Produto").should("be.visible");
    cy.contains("Mesa").should("be.visible");

    // Close modal
    cy.contains("button", "Fechar").click();
    cy.contains("Detalhes do Produto").should("not.exist");
  });

  it("should open delete confirmation for a product", () => {
    cy.visit("/products");
    cy.wait("@getProducts");

    // Click the delete icon button (red trash)
    cy.get('button[title="Excluir produto"]').first().click();

    // Confirmation modal
    cy.contains("Excluir Produto").should("be.visible");
    cy.contains("Mesa").should("be.visible");

    // Cancel
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir Produto").should("not.exist");
  });

  // ── Responsive Navigation ────────────────────────────────────────
  it("should toggle mobile menu on small screens", () => {
    cy.viewport(375, 667); // iPhone SE
    cy.visit("/");

    // Desktop nav should be hidden
    cy.get('nav[aria-label="Main navigation"]').should("not.be.visible");

    // Open mobile menu
    cy.get('button[aria-label="Toggle navigation menu"]').click();
    cy.get("#mobile-menu").should("be.visible");
    cy.get("#mobile-menu").contains("Matérias-Primas").should("be.visible");

    // Navigate from mobile menu
    cy.contains("#mobile-menu a", "Produtos").click();
    cy.url().should("include", "/products");
  });
});
