describe('InvenTrak - Pruebas de Dashboard', () => {
  // Antes de cada prueba, visita la página
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('Debe cargar el Panel de Inventario con los datos correctos', () => {
    // 1. Verifica que el título principal sea visible
    cy.contains('Panel de Inventario').should('be.visible');

    // 2. Verifica que aparezca la métrica de productos
    cy.contains('Total Productos').should('be.visible');
    
    // 3. Verifica que el número de productos sea el que vimos en tu captura (6)
    cy.get('body').should('contain', '6');
  });

  it('Debe verificar que el Stock Total sea visible', () => {
    // Busca el texto de la capacidad que vimos en tu pantalla
    cy.contains('Stock Total').should('be.visible');
    cy.contains('115').should('be.visible');
  });
});