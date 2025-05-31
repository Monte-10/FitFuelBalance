import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateComparativePlan.css';

const API_URL = process.env.REACT_APP_API_URL;

const CreateComparativePlan = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [tableName, setTableName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    if (isEditMode && id) {
      fetchTableData();
    }
  }, [isEditMode, id]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user/regularusers/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results || []);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar usuarios');
    }
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/nutrition/comparative-tables/${id}/`,
        { headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` } }
      );
      setTableName(response.data.name);
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError('Error al cargar datos de la tabla');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !tableName) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const data = {
        user: selectedUser,
        name: tableName,
        comparative_plans: [
          { 
            name: 'Plan A', 
            order: 1,
            description: 'Comidas diferentes, mismos macros. Elige este plan si prefieres estas combinaciones para tu día.'
          },
          { 
            name: 'Plan B', 
            order: 2,
            description: 'Comidas diferentes, mismos macros. Alternativa para variar tus comidas sin cambiar tus macros.'
          },
          { 
            name: 'Plan C', 
            order: 3,
            description: 'Comidas diferentes, mismos macros. Otra opción para que elijas según tus gustos o lo que tengas disponible.'
          }
        ]
      };

      if (isEditMode) {
        const res = await axios.put(
          `${API_URL}/nutrition/comparative-tables/${id}/`,
          data,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
          }
        );
        navigate(`/nutrition/comparative-table/${id}/edit`);
      } else {
        const res = await axios.post(
          `${API_URL}/nutrition/comparative-tables/`,
          data,
          {
            headers: {
              'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
          }
        );
        navigate(`/nutrition/comparative-table/${res.data.id}/edit`);
      }
    } catch (error) {
      console.error('Error saving table:', error);
      setError('Error al guardar la tabla');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="create-comparative-plan-container">
      <div className="create-comparative-plan-box">
        <h2>{isEditMode ? 'Editar Planes de Dieta' : 'Crear Planes de Dieta'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tableName">Nombre del Conjunto de Planes:</label>
            <input
              type="text"
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Ej: Planes de Dieta Mensual"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userSelect">Usuario:</label>
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Selecciona un usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/nutrition/comparative-table')} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              {isEditMode ? 'Actualizar' : 'Crear'} Planes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComparativePlan; 