import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpDown, History, PlusCircle, Eye, EyeOff, MessageSquare } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const MovementsView = ({ products, onRefresh }) => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Estado para el ojito

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/movements`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [products]);

  const toggleNote = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMovement = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      await axios.post(`${API}/movements`, formData);
      await fetchHistory();
      onRefresh();
      e.target.reset();
      alert("Movimiento registrado exitosamente");
    } catch (err) {
      alert("Error al procesar la transacción");
    }
  };

  return (
    <div className="dashboard-grid animate-fade">
      {/* SECCIÓN IZQUIERDA: TABLA */}
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
                <th style={{ textAlign: 'center' }}>NOTA</th> {/* Cambiado por el ojito */}
              </tr>
            </thead>
            <tbody>
              {history.map((m) => (
                <React.Fragment key={m.id}>
                  <tr>
                    <td style={{ fontSize: '0.7rem', color: 'var(--text-ghost)' }}>
                      {new Date(m.movement_date).toLocaleDateString()}
                    </td>
                    <td className="col-name">{m.product_name}</td>
                    <td>
                      <span className={`badge ${m.type === 'IN' || m.type === 'ENTRADA' ? 'ok' : 'low'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => toggleNote(m.id)}
                        className="btn-icon"
                        style={{ color: expandedId === m.id ? 'var(--accent-cyan)' : 'var(--text-ghost)' }}
                      >
                        {expandedId === m.id ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>

                  {/* FILA DESPLEGABLE DE LA NOTA */}
                  {expandedId === m.id && (
                    <tr className="note-row-animation">
                      <td colSpan="4" style={{ padding: '10px 15px', background: 'rgba(0, 242, 255, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                          <MessageSquare size={14} />
                          <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>MOTIVO:</span>
                          <span style={{ color: 'var(--text-bright)', fontStyle: 'italic' }}>
                            {m.reason || "Sin observaciones registradas."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN DERECHA: FORMULARIO (Se mantiene igual) */}
      <aside className="form-card">
        {/* ... (Tu código de formulario actual) ... */}
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
            <input name="quantity" type="number" min="1" required className="cyber-input" />
          </div>
          <div className="form-group">
            <label>Motivo o Nota</label>
            <input name="reason" placeholder="Ej: Venta directa" required className="cyber-input" />
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