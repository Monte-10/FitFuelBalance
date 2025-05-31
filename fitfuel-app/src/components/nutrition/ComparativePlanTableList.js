import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ComparativePlanTable.css';

const API_URL = process.env.REACT_APP_API_URL;

function ComparativePlanTableList() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/nutrition/comparative-tables/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
          params: { page, page_size: pageSize }
        });
        // Asegura que tables siempre sea un array
        const data = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response.data.results) ? response.data.results : []);
        setTables(data);
        // Actualiza paginación
        if (response.data.count !== undefined) {
          setTotalCount(response.data.count);
          setTotalPages(Math.ceil(response.data.count / pageSize));
        }
      } catch (err) {
        setError('Error al cargar las tablas comparativas');
      }
      setLoading(false);
    };
    fetchTables();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container mt-4 comparative-table-list-container">
      <h2 className="edit-plan-title">Tablas Comparativas Creadas</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario Asignado</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tables.length === 0 && (
            <tr><td colSpan={4}>No hay tablas comparativas creadas.</td></tr>
          )}
          {tables.map(table => (
            <tr key={table.id}>
              <td>{table.name}</td>
              <td>{table.user_username || table.user || '-'}</td>
              <td>{table.created_at ? new Date(table.created_at).toLocaleDateString() : '-'}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/nutrition/comparative-table/${table.id}`)}>
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 24px', 
        backgroundColor: '#23272b', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
        marginTop: '32px',
        color: '#f8f9fa',
        fontSize: '1.1rem',
        minHeight: '64px'
      }}>
        <div>
          <button
            className="btn"
            style={{
              backgroundColor: page === 1 ? '#6c757d' : '#198754',
              color: '#fff',
              border: 'none',
              marginRight: '8px',
              minWidth: '90px',
              fontWeight: 'bold',
              opacity: page === 1 ? 0.7 : 1
            }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span style={{ margin: '0 16px', fontWeight: 'bold' }}>
            Página {page} de {totalPages} <span style={{ fontWeight: 'normal', fontSize: '0.95em' }}>(Total: {totalCount})</span>
          </span>
          <button
            className="btn"
            style={{
              backgroundColor: page >= totalPages ? '#6c757d' : '#198754',
              color: '#fff',
              border: 'none',
              minWidth: '90px',
              fontWeight: 'bold',
              opacity: page >= totalPages ? 0.7 : 1
            }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className="me-2" style={{ color: '#f8f9fa', fontWeight: 'bold' }}>Mostrar:</label>
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="form-select"
            style={{ width: '80px', fontSize: '1.1rem', background: '#343a40', color: '#fff', border: '1px solid #495057', borderRadius: '6px', fontWeight: 'bold' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ComparativePlanTableList; 