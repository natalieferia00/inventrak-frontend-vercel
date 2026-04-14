import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Smoke Test - InvenTrak', () => {
  
  it('La aplicación carga sin romperse', () => {
    // Renderizamos App pero le damos un momento para procesar los hijos
    const { container } = render(<App />);
    
    // Verificamos que el contenedor principal de React no esté vacío
    expect(container).not.toBeEmptyDOMElement();
  });

  it('Verifica la presencia del nombre de la marca', () => {
    render(<App />);
    
    // Buscamos "InvenTrak" en la pantalla
    const brand = screen.getByText(/InvenTrak/i);
    expect(brand).toBeInTheDocument();
  });
});