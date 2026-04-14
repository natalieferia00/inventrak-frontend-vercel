import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductForm from '../ProductForm';
import { BrowserRouter } from 'react-router-dom';

// 1. Mock de axios para evitar llamadas reales a la API
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
  },
}));

describe('ProductForm Component', () => {
  const mockCategories = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Hogar' }
  ];

  // TEST 1: Modo Creación
  it('debe renderizar el título correcto en modo creación', () => {
    render(
      <BrowserRouter>
        <ProductForm categories={mockCategories} />
      </BrowserRouter>
    );

    const titleElement = screen.getByText(/REGISTRAR NUEVO ARTÍCULO/i);
    expect(titleElement).toBeInTheDocument();
  });

  // TEST 2: Presencia de Inputs
  it('debe mostrar los campos de texto principales', () => {
    render(
      <BrowserRouter>
        <ProductForm categories={mockCategories} />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Ej: Sensor Pro X/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/INV-001/i)).toBeInTheDocument();
  });

  // TEST 3: Modo Edición (Fuera de los otros tests)
  it('debe cargar los datos del producto y cambiar el título en modo edición', () => {
    const productToEdit = {
      id: 99,
      sku: 'EDIT-SKU-123',
      name: 'Producto Existente',
      description: 'Esta es una descripción previa',
      category_id: 1
    };

    render(
      <BrowserRouter>
        <ProductForm 
          categories={mockCategories} 
          editingProduct={productToEdit} 
        />
      </BrowserRouter>
    );

    // Verifica cambio de título
    expect(screen.getByText(/EDITAR ARTÍCULO/i)).toBeInTheDocument();

    // Verifica que los valores se cargaron en los inputs
    expect(screen.getByDisplayValue('EDIT-SKU-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Producto Existente')).toBeInTheDocument();
  });
});