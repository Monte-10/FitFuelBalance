import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComparativePlanTable.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ComparativeMealTable from './ComparativeMealTable';

const API_URL = process.env.REACT_APP_API_URL;

const DEFAULT_MEALS = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena'];

function ComparativePlanTable() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const userIdFromQuery = searchParams.get('user');
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userIdFromQuery || '');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ quantity: '', unit: 'g' });
  const [tableName, setTableName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchIngredients();
    if (id) {
      fetchTableById(id);
    } else if (userIdFromQuery) {
      fetchTableByUser(userIdFromQuery);
    }
  }, [id, userIdFromQuery]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user/regularusers/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${API_URL}/nutrition/ingredients/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      setIngredients(response.data.results || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const fetchTableByUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/nutrition/comparative-tables/?user=${userId}`,
        { headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` } }
      );
      setTable(response.data[0] || null);
      setTableName(response.data[0]?.name || '');
    } catch (error) {
      console.error('Error fetching table:', error);
    }
    setLoading(false);
  };

  const fetchTableById = async (tableId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/nutrition/comparative-tables/${tableId}/`,
        { headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` } }
      );
      setTable(response.data || null);
      setSelectedUser(response.data.user);
      setTableName(response.data.name);
    } catch (error) {
      console.error('Error fetching table by id:', error);
    }
    setLoading(false);
  };

  const handleUserChange = async (e) => {
    const newUserId = e.target.value;
    setSelectedUser(newUserId);

    if (table) {
      try {
        await axios.put(
          `${API_URL}/nutrition/comparative-tables/${table.id}/`,
          {
            user: newUserId,
            name: table.name,
            comparative_plans: table.comparative_plans.map(plan => ({
              id: plan.id,
              name: plan.name,
              order: plan.order,
              description: plan.description,
              meals: plan.meals ? plan.meals.map(meal => ({
                id: meal.id,
                meal_number: meal.meal_number,
                name: meal.name,
                time: meal.time,
                ingredients: meal.ingredients ? meal.ingredients.map(ing => ({
                  id: ing.id,
                  ingredient: ing.ingredient,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  notes: ing.notes
                })) : []
              })) : []
            }))
          },
          {
            headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
          }
        );
        setTimeout(() => {
          fetchTableById(table.id);
        }, 300);
      } catch (error) {
        alert('Error al asignar el usuario');
        console.error(error);
      }
    } else {
      fetchTableByUser(newUserId);
    }
  };

  const handleCellClick = (planIdx, mealIdx) => {
    setSelectedCell({ planIdx, mealIdx });
    const currentMeal = table?.comparative_plans[planIdx]?.meals[mealIdx];
    setSelectedIngredients(currentMeal?.ingredients || []);
    setShowModal(true);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.ingredient || !newIngredient.quantity) return;
    setSelectedIngredients([...selectedIngredients, newIngredient]);
    setNewIngredient({ quantity: '', unit: 'g' });
  };

  const handleRemoveIngredient = (index) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleSaveMeal = async () => {
    if (!selectedCell || !table) return;
    try {
      const planId = table.comparative_plans[selectedCell.planIdx].id;
      const mealData = {
        plan: planId,
        meal_number: selectedCell.mealIdx + 1,
        name: DEFAULT_MEALS[selectedCell.mealIdx],
        ingredients: selectedIngredients
      };
      const response = await axios.post(`${API_URL}/nutrition/comparative-meals/`, mealData, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      const updatedTable = { ...table };
      if (!updatedTable.comparative_plans[selectedCell.planIdx].meals) {
        updatedTable.comparative_plans[selectedCell.planIdx].meals = [];
      }
      updatedTable.comparative_plans[selectedCell.planIdx].meals[selectedCell.mealIdx] = response.data;
      setTable(updatedTable);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleSaveTable = async () => {
    if (!table) return;
    setSaving(true);
    setError(null);
    try {
      setTimeout(() => {
        setSaving(false);
        alert('Tabla comparativa guardada correctamente.');
      }, 800);
    } catch (err) {
      setError('Error al guardar la tabla.');
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="container mt-4 create-plan-container">
      <div className="edit-plan-header-box">
        <h2 className="edit-plan-title">Editar Tabla Comparativa</h2>
        <div className="edit-plan-name">{tableName}</div>
      </div>
      <div className="assign-user-box">
        <label htmlFor="userSelect" className="assign-user-label">Asignar a Usuario:</label>
        <select
          id="userSelect"
          className="assign-user-select"
          value={selectedUser}
          onChange={handleUserChange}
          required
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      {table ? (
        <ComparativeMealTable comparativePlans={table.comparative_plans} tableId={table.id} userId={selectedUser} onSave={handleSaveTable} />
      ) : (
        <div className="no-plans-message">
          No hay planes de dieta para este usuario.
          <button 
            onClick={() => navigate('/nutrition/comparative-table/create')}
            className="create-plans-btn"
          >
            Crear Planes
          </button>
        </div>
      )}
      {showModal && (
        <div className="comparative-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="comparative-modal" onClick={e => e.stopPropagation()}>
            <h3>Editar {DEFAULT_MEALS[selectedCell.mealIdx]} - {table.comparative_plans[selectedCell.planIdx].name}</h3>
            <div className="ingredients-section">
              <h4>Ingredientes actuales</h4>
              <ul className="current-ingredients-list">
                {selectedIngredients.map((ing, index) => (
                  <li key={index} className="current-ingredient-item">
                    <span>{ing.ingredient_name}</span>
                    <span>{ing.quantity} {ing.unit}</span>
                    <button 
                      onClick={() => handleRemoveIngredient(index)}
                      className="remove-ingredient-btn"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="add-ingredient-section">
              <h4>Añadir ingrediente</h4>
              <div className="add-ingredient-form">
                <select
                  value={newIngredient.ingredient || ''}
                  onChange={(e) => setNewIngredient({
                    ...newIngredient,
                    ingredient: e.target.value,
                    ingredient_name: e.target.options[e.target.selectedIndex].text
                  })}
                  className="ingredient-select"
                >
                  <option value="">Seleccionar ingrediente</option>
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({
                    ...newIngredient,
                    quantity: e.target.value
                  })}
                  placeholder="Cantidad"
                  className="quantity-input"
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({
                    ...newIngredient,
                    unit: e.target.value
                  })}
                  className="unit-select"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="unidad">unidad</option>
                </select>
                <button onClick={handleAddIngredient} className="add-ingredient-btn">
                  Añadir
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveMeal} className="save-meal-btn">
                Guardar Comida
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparativePlanTable; 