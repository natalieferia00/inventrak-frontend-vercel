import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ProductsView = ({ products, onEdit, onDelete }) => {
  return (
    <div className="card-table animate-fade">
      <div className="view-header">
        <h2>📦 MAESTRO DE ARTÍCULOS</h2>
      </div>
      
      <div className="table-container">
        <table className="table-cyberpunk">
          <thead>
            <tr>
              <th className="col-sku">SKU</th>
              <th className="col-name">NOMBRE</th>
              <th className="col-desc">DESCRIPCIÓN</th>
              <th className="col-stock">STOCK</th>
              <th className="col-actions">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id || product.id}>
                  <td className="col-sku">{product.sku}</td>
                  <td className="col-name">{product.name}</td>
                  <td className="col-desc">
                    {product.description || '—'}
                  </td>
                  <td className="col-stock">
                    <span className={`badge ${product.current_stock > 5 ? 'ok' : 'low'}`}>
                      {product.current_stock}
                    </span>
                  </td>
                  <td className="col-actions">
                    <button 
                      className="btn-icon edit" 
                      onClick={() => onEdit(product)}
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="btn-icon trash" 
                      onClick={() => onDelete(product._id || product.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-ghost)' }}>
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsView;