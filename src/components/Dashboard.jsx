import React from 'react';
import { 
  Package, AlertTriangle, TrendingUp, Layers, Activity 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const Dashboard = ({ products, categories }) => {
  // --- LÓGICA ---
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.current_stock <= (p.min_stock_level || 5)).length;

  // Gráfico de Barras: Top 5
  const barData = [...products]
    .sort((a, b) => b.current_stock - a.current_stock)
    .slice(0, 5)
    .map(p => ({ name: p.name.substring(0, 10), stock: p.current_stock }));

  // Gráfico Circular: Categorías
  const pieData = categories.map(cat => ({
    name: cat.name,
    value: products.filter(p => p.category_id === cat.id).length
  })).filter(data => data.value > 0);

  const COLORS = ['#00f2ff', '#ff00ff', '#2563eb', '#7c3aed', '#06b6d4'];

  return (
    <div className="dashboard-container animate-fade">
      <div className="welcome-msg">
        <div className="status-badge">
          <span className="status-dot"></span> TERMINAL DE CONTROL v1.0.4
        </div>
        <h2>Panel de Inventario</h2>
      </div>

      {/* --- SOLO 2 CARDS PRINCIPALES --- */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* CARD 1: TOTAL (CIAN) */}
        <div className="kpi-card">
          <h3>Total Productos</h3>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-footer">SKUs REGISTRADOS</div>
          <Package className="card-icon-bg" size={80} />
        </div>

        {/* CARD 2: ALERTAS (MAGENTA) */}
        <div className="kpi-card danger">
          <h3>Alertas Críticas</h3>
          <div className="kpi-value neon-text-magenta">{lowStockProducts}</div>
          <div className="kpi-footer">BAJO NIVEL DE STOCK</div>
          <AlertTriangle className="card-icon-bg" size={80} />
        </div>

      </div>

      {/* --- SECCIÓN DE GRÁFICOS --- */}
      <div className="charts-grid">
        
        <div className="chart-card">
          <div className="chart-header">
            <TrendingUp size={18} color="var(--accent-cyan)" />
            <h3>Análisis de Existencias</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #00f2ff', color: '#fff' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Bar dataKey="stock" fill="url(#colorCian)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorCian" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <Layers size={18} color="var(--accent-magenta)" />
            <h3>Distribución por Categoría</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="dashboard-lower-section">
        <div className="activity-card">
          <div className="card-header">
            <Activity size={20} color="#00f2ff" />
            <h3>Monitor del Sistema</h3>
          </div>
          <div className="activity-item">
            <span>Servidor Render:</span>
            <span className="status-text green">ONLINE</span>
          </div>
          <div className="activity-item">
            <span>Base de Datos Railway:</span>
            <span className="status-text cyan">SINCRONIZADA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;