import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ComparativePlanTable.css';

const API_URL = process.env.REACT_APP_API_URL;

function ComparativePlanTableDetail() {
  const { id } = useParams();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [role, setRole] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/nutrition/comparative-tables/${id}/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        setTable(response.data);
      } catch (err) {
        setError('Error al cargar la tabla comparativa');
      }
      setLoading(false);
    };
    fetchTable();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/profile/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        setRole(res.data?.role || null);
        setIsSuperuser(!!res.data?.is_superuser);
        
      } catch (_) {}
    };
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar esta tabla comparativa?')) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/nutrition/comparative-tables/${id}/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      navigate('/nutrition/comparative-tables');
    } catch (err) {
      setError('Error al eliminar la tabla');
    }
    setDeleting(false);
  };

  const handleExportPDF = async () => {
    try {
      const response = await axios.get(`${API_URL}/nutrition/comparative-tables/${id}/export-pdf/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        responseType: 'blob'
      });
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plan_comida_${table.name}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando PDF:', err);
      setError('Error al exportar el PDF');
    }
  };

  // Calcula resumen de macros por plan
  const getPlanMacros = (plan) => {
    const totals = { calories: 0, protein: 0, fat: 0, carbohydrates: 0, sugar: 0 };
    if (!plan.meals) return totals;
    plan.meals.forEach(meal => {
      if (meal.ingredients) {
        meal.ingredients.forEach(ing => {
          const factor = Number(ing.quantity) / 100;
          totals.calories += (Number(ing.calories) || 0) * factor;
          totals.protein += (Number(ing.protein) || 0) * factor;
          totals.fat += (Number(ing.fat) || 0) * factor;
          totals.carbohydrates += (Number(ing.carbohydrates) || 0) * factor;
          totals.sugar += (Number(ing.sugar) || 0) * factor;
        });
      }
    });
    return totals;
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!table) return <div>No se encontró la tabla.</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}>
      <div style={{
        background: 'rgba(30, 32, 34, 0.92)',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        padding: '32px 32px 24px 32px',
        maxWidth: 1100,
        width: '100%',
        margin: '0 auto',
        marginBottom: 32
      }}>
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '2.5rem', textAlign: 'center', textShadow: '0 2px 8px #000' }}>{table.name}</h2>
        
        {/* Botón de Exportar PDF - Visible para TODOS */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button 
            onClick={handleExportPDF}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
            }}
          >
            📄 Exportar a PDF
          </button>
        </div>
        
        <div style={{ color: '#e0e0e0', fontSize: '1.1rem', margin: '16px 0 8px 0', textAlign: 'left' }}>
          <b>Usuario asignado:</b> {table.user_username || table.user || '-'}<br />
          <b>Fecha de creación:</b> {table.created_at ? new Date(table.created_at).toLocaleDateString() : '-'}
        </div>
        <h4 style={{ color: '#b6ffb6', fontWeight: 600, margin: '32px 0 18px 0', textShadow: '0 1px 4px #000' }}>Resumen de Macros por Plan</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderRadius: 16, overflow: 'hidden', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
            <thead>
              <tr style={{ background: '#2ecc40' }}>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Plan</th>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Calorías</th>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Proteínas</th>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Grasas</th>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Carbohidratos</th>
                <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Azúcares</th>
              </tr>
            </thead>
            <tbody>
              {table.comparative_plans && table.comparative_plans.map(plan => {
                const macros = getPlanMacros(plan);
                return (
                  <tr key={plan.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ color: '#b6ffb6', fontWeight: 600, padding: 10, border: 'none' }}>{plan.name}</td>
                    <td style={{ color: '#fff', padding: 10, border: 'none' }}>{macros.calories.toFixed(2)}</td>
                    <td style={{ color: '#fff', padding: 10, border: 'none' }}>{macros.protein.toFixed(2)}g</td>
                    <td style={{ color: '#fff', padding: 10, border: 'none' }}>{macros.fat.toFixed(2)}g</td>
                    <td style={{ color: '#fff', padding: 10, border: 'none' }}>{macros.carbohydrates.toFixed(2)}g</td>
                    <td style={{ color: '#fff', padding: 10, border: 'none' }}>{macros.sugar.toFixed(2)}g</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(role === 'trainer' || isSuperuser) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36 }}>
            <button className="btn btn-primary" style={{ flex: 1, marginRight: 16, fontSize: '1.2rem', padding: '16px 0', borderRadius: 10, fontWeight: 600 }} onClick={() => navigate(`/nutrition/comparative-table/${table.id}/edit`)}>
              Editar Plan
            </button>
            <button className="btn btn-danger" style={{ minWidth: 160, fontSize: '1.2rem', padding: '16px 0', borderRadius: 10, fontWeight: 600 }} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar Plan'}
            </button>
          </div>
        )}
        {/* Tabla detallada de comidas para clientes */}
        {role !== 'trainer' && !isSuperuser && table.comparative_plans && (
          <div style={{ marginTop: 40 }}>
            <h4 style={{ color: '#b6ffb6', fontWeight: 600, margin: '32px 0 18px 0', textShadow: '0 1px 4px #000' }}>Detalle de Comidas por Plan</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderRadius: 16, overflow: 'hidden', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                <thead>
                  <tr style={{ background: '#2ecc40' }}>
                    <th style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>Comida</th>
                    {table.comparative_plans.map((plan, planIdx) => (
                      <th key={planIdx} style={{ color: '#fff', fontWeight: 700, padding: 12, fontSize: '1.1rem', border: 'none' }}>{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena'].map((mealName, mealIdx) => (
                    <tr key={mealIdx} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ color: '#b6ffb6', fontWeight: 600, padding: 10, border: 'none', fontSize: '1.1rem' }}>{mealName}</td>
                      {table.comparative_plans.map((plan, planIdx) => {
                        const meal = plan.meals && plan.meals[mealIdx];
                        const ingredients = meal && meal.ingredients ? meal.ingredients : [];
                        return (
                          <td key={planIdx} style={{ color: '#fff', padding: 10, border: 'none', verticalAlign: 'top' }}>
                            {ingredients.length > 0 ? (
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {ingredients.map(ingredient => {
                                  const factor = Number(ingredient.quantity) / 100;
                                  const ingredientName = ingredient.ingredient_name || ingredient.name || 'Ingrediente sin nombre';
                                  return (
                                    <li key={ingredient.id || ingredient.ingredient} style={{ 
                                      marginBottom: 8, 
                                      padding: 8, 
                                      background: '#1e2124', 
                                      borderRadius: 6,
                                      border: '1px solid #343a40'
                                    }}>
                                      <div style={{ fontWeight: 600, color: '#e0e0e0', marginBottom: 4 }}>
                                        {ingredientName}
                                      </div>
                                      <div style={{ fontSize: '0.9rem', color: '#bbb' }}>
                                        <span style={{ marginRight: 12 }}>
                                          <strong>Cantidad:</strong> {ingredient.quantity}g
                                        </span>
                                        <span style={{ marginRight: 12 }}>
                                          <strong>Calorías:</strong> {((Number(ingredient.calories) || 0) * factor).toFixed(1)}
                                        </span>
                                        <span style={{ marginRight: 12 }}>
                                          <strong>Proteínas:</strong> {((Number(ingredient.protein) || 0) * factor).toFixed(1)}g
                                        </span>
                                        <span style={{ marginRight: 12 }}>
                                          <strong>Grasas:</strong> {((Number(ingredient.fat) || 0) * factor).toFixed(1)}g
                                        </span>
                                        <span>
                                          <strong>Carbohidratos:</strong> {((Number(ingredient.carbohydrates) || 0) * factor).toFixed(1)}g
                                        </span>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p style={{ color: '#adb5bd', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
                                Sin ingredientes
                              </p>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparativePlanTableDetail; 