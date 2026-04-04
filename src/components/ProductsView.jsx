import React, { useState } from 'react';
import { Pencil, Trash2, Tag, Info, ChevronDown, ChevronUp } from 'lucide-react';

const ProductsView = ({ products, onEdit, onDelete }) => {
  // Estado para rastrear qué fila está expandida (por ID)
  const [expandedId, setExpandedId] = useState(null);

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="card-table animate-fade">
      <div className="view-header">
        <h2>MAESTRO DE ARTÍCULOS</h2>
      </div>
      
      <div className="table-container">
        <table className="table-cyberpunk">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th> {/* Espacio para el icono de expandir */}
              <th className="col-sku">SKU</th>
              <th className="col-name">NOMBRE</th>
              <th className="col-category">CATEGORÍA</th>
              <th className="col-stock">STOCK</th>
              <th className="col-actions">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product.id || product._id}>
                {/* FILA PRINCIPAL */}
                <tr className={expandedId === (product.id || product._id) ? 'row-expanded' : ''}>
                  <td>
                    <button className="btn-expand" onClick={() => toggleRow(product.id || product._id)}>
                      {expandedId === (product.id || product._id) ? <ChevronUp size={16} /> : <Info size={16} />}
                    </button>
                  </td>
                  <td className="col-sku">{product.sku}</td>
                  <td className="col-name"><strong>{product.name}</strong></td>
                  <td className="col-category">
                    <span className="category-pill">{product.category_name || 'Sin Categoría'}</span>
                  </td>
                  <td className="col-stock">
                    <span className={`badge ${product.current_stock > 5 ? 'ok' : 'low'}`}>
                      {product.current_stock}
                    </span>
                  </td>
                  <td className="col-actions">
                    <button className="btn-icon edit" onClick={() => onEdit(product)}><Pencil size={18} /></button>
                    <button className="btn-icon trash" onClick={() => onDelete(product.id || product._id)}><Trash2 size={18} /></button>
                  </td>
                </tr>

                {/* FILA DE DETALLES (Solo se ve si está expandida) */}
                {expandedId === (product.id || product._id) && (
                  <tr className="detail-row">
                    <td colSpan="6">
                      <div className="detail-content">
                        <div className="detail-grid">
                          <div className="detail-item">
                            <label>DESCRIPCIÓN TÉCNICA:</label>
                            <p>{product.description || 'No hay especificaciones adicionales para este artículo.'}</p>
                          </div>
                          <div className="detail-item">
                            <label>ID DE SISTEMA:</label>
                            <code>{product.id || product._id}</code>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsView;