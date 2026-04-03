import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpDown, History, Package, PlusCircle } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const MovementsView = ({ products, onRefresh }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener el historial (la reutilizamos)
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/movements`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial y cuando cambian los productos
  useEffect(() => {
    fetchHistory();
  }, [products]);

  const handleMovement = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    
    try {
      // 1. Enviar el movimiento al backend
      await axios.post(`${API}/movements`, formData);
      
      // 2. Refrescar historial local inmediatamente
      await fetchHistory();
      
      // 3. Notificar al App.jsx para actualizar el stock global
      onRefresh();
      
      e.target.reset();
      alert("Movimiento registrado exitosamente");
    } catch (err) {
      console.error("Error en transacción:", err);
      alert("Error al procesar la transacción");
    }
  };

  return (
    <div className="dashboard-grid animate-fade">
      {/* SECCIÓN IZQUIERDA: TABLA DE HISTORIAL */}
      <section className="table-card">
        <div className="view-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={24} color="var(--accent-cyan)" />
          <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>HISTORIAL RECIENTE</h2>
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>PRODUCTO</th>
                <th>TIPO</th>
                <th>CANT.</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-ghost)' }}>
                      {new Date(m.movement_date).toLocaleString()}
                    </td>
                    <td className="col-name">{m.product_name}</td>
                    <td>
                      <span className={`badge ${m.type === 'IN' || m.type === 'ENTRADA' ? 'ok' : 'low'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="col-stock" style={{ fontWeight: 'bold' }}>
                      {m.quantity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-ghost)' }}>
                    No hay movimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN DERECHA: FORMULARIO DE REGISTRO */}
      <aside className="form-card">
        <div className="view-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle size={20} color="var(--accent-cyan)" />
          <h4 style={{ margin: 0 }}>REGISTRAR STOCK</h4>
        </div>

        <form onSubmit={handleMovement} className="inventory-form">
          <div className="form-group">
            <label>Seleccionar Producto</label>
            <select name="product_id" required className="cyber-input">
              <option value="">Buscar item...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.current_stock})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Operación</label>
            <select name="type" className="cyber-input" required>
              <option value="IN">ENTRADA (+)</option>
              <option value="OUT">SALIDA (-)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input 
              name="quantity" 
              type="number" 
              min="1" 
              placeholder="0" 
              required 
              className="cyber-input"
            />
          </div>

          <div className="form-group">
            <label>Motivo o Nota</label>
            <input 
              name="reason" 
              placeholder="Ej: Reposición de inventario" 
              required 
              className="cyber-input"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            <ArrowUpDown size={18} /> EJECUTAR TRANSACCIÓN
          </button>
        </form>
      </aside>
    </div>
  );
};

export default MovementsView;