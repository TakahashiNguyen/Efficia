describe('Editor Toolbar Tabbed Interface', () => {
  beforeEach(() => {
    // Assuming the dev server is running at the baseUrl
    cy.visit('/');
    // Wait for the editor to be visible
    cy.get('[data-testid="tiptap-editor"]').should('be.visible');
  });

  it('should have the Home tab active by default on load', () => {
    cy.get('[data-testid="toolbar-tab-home"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="toolbar-tool-bold"]').should('be.visible');
  });

  it('should switch toolbar tools when changing tabs', () => {
    // Switch to Insert tab
    cy.get('[data-testid="toolbar-tab-insert"]').click();
    cy.get('[data-testid="toolbar-tab-insert"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="toolbar-tool-bold"]').should('not.exist');

    // Switch back to Home
    cy.get('[data-testid="toolbar-tab-home"]').click();
    cy.get('[data-testid="toolbar-tab-home"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="toolbar-tool-bold"]').should('be.visible');
  });

  it('should apply basic formatting in the Home tab', () => {
    const text = 'Hello World';

    // Type text into the editor
    cy.get('[data-testid="tiptap-editor"]')
      .focus()
      .type(text);

    // Select the text (using a common way in Cypress to select all text in an element)
    cy.get('[data-testid="tiptap-editor"]').then(($el) => {
      const range = $el[0].ownerDocument.createRange();
      range.selectNodeContents($el[0]);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });

    // Bold
    cy.get('[data-testid="toolbar-tool-bold"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('strong').should('contain', text);

    // Italic
    cy.get('[data-testid="toolbar-tool-italic"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('em').should('contain', text);

    // Bullet List
    cy.get('[data-testid="toolbar-tool-bullet-list"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('ul li').should('exist');
  });

  it('should handle undo and redo operations in the Review tab', () => {
    const text = 'Undo Test';

    // Type text
    cy.get('[data-testid="tiptap-editor"]').type(text);

    // Apply Bold
    cy.get('[data-testid="toolbar-tool-bold"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('strong').should('exist');

    // Switch to Review tab
    cy.get('[data-testid="toolbar-tab-review"]').click();

    // Undo
    cy.get('[data-testid="toolbar-tool-undo"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('strong').should('not.exist');

    // Redo
    cy.get('[data-testid="toolbar-tool-redo"]').click();
    cy.get('[data-testid="tiptap-editor"]').find('strong').should('exist');
  });
});
