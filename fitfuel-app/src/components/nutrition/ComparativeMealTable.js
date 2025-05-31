import React, { useState, useEffect } from 'react';
import './MealTable.css';
import IngredientModal from './IngredientModal';
import axios from 'axios';

const DEFAULT_MEALS = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena'];
const DEFAULT_TIMES = ['08:00', '11:00', '14:00', '17:00', '21:00'];

const ComparativeMealTable = ({ comparativePlans, tableId, userId, onSave }) => {
  // Estado: ingredientes por plan y comida
  // { planIdx: { mealIdx: [ { id, name, quantity, unit }, ... ] } }
  const [ingredientsByPlan, setIngredientsByPlan] = useState({});
  const [modalMeal, setModalMeal] = useState(null); // { planIdx, mealIdx }
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('g');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientPage, setIngredientPage] = useState(1);
  const [ingredientPageSize, setIngredientPageSize] = useState(10);
  const [ingredientTotalPages, setIngredientTotalPages] = useState(1);
  const [ingredientTotalCount, setIngredientTotalCount] = useState(0);
  const [ingredientResults, setIngredientResults] = useState([]);
  const [nutritionTotals, setNutritionTotals] = useState({});

  // Inicializa el estado local con los datos del backend solo si hay comparativePlans y tableId
  useEffect(() => {
    if (comparativePlans && comparativePlans.length && tableId) {
      const initial = {};
      comparativePlans.forEach((plan, planIdx) => {
        initial[planIdx] = {};
        for (let mealIdx = 0; mealIdx < 5; mealIdx++) {
          initial[planIdx][mealIdx] = plan.meals && plan.meals[mealIdx] && plan.meals[mealIdx].ingredients
            ? plan.meals[mealIdx].ingredients.map(ing => ({
                id: ing.ingredient || ing.id,
                name: ing.ingredient_name || ing.name,
                quantity: ing.quantity,
                unit: ing.unit || 'g',
                calories: ing.calories || 0,
                protein: ing.protein || 0,
                fat: ing.fat || 0,
                carbohydrates: ing.carbohydrates || 0,
                sugar: ing.sugar || 0
              }))
            : [];
        }
      });
      setIngredientsByPlan(initial);
    }
  }, [comparativePlans, tableId]);

  // Calcular totales al cambiar ingredientes
  useEffect(() => {
    const totals = {};
    comparativePlans.forEach((plan, planIdx) => {
      const planTotals = { calories: 0, protein: 0, fat: 0, carbohydrates: 0, sugar: 0 };
      if (ingredientsByPlan[planIdx]) {
        Object.values(ingredientsByPlan[planIdx]).forEach(arr => {
          (arr || []).forEach(ing => {
            const factor = Number(ing.quantity) / 100;
            planTotals.calories += (Number(ing.calories) || 0) * factor;
            planTotals.protein += (Number(ing.protein) || 0) * factor;
            planTotals.fat += (Number(ing.fat) || 0) * factor;
            planTotals.carbohydrates += (Number(ing.carbohydrates) || 0) * factor;
            planTotals.sugar += (Number(ing.sugar) || 0) * factor;
          });
        });
      }
      totals[planIdx] = planTotals;
    });
    setNutritionTotals(totals);
  }, [ingredientsByPlan, comparativePlans]);

  // Cargar ingredientes paginados
  const fetchIngredients = async (search = '', page = 1, pageSize = 10) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    let url = `${apiUrl}/nutrition/ingredients/?page=${page}&page_size=${pageSize}`;
    if (search) url += `&search=${search}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
    });
    const data = await res.json();
    setIngredientResults(data.results);
    setIngredientTotalCount(data.count);
    setIngredientTotalPages(Math.ceil(data.count / pageSize));
  };

  useEffect(() => {
    if (showIngredientModal) {
      fetchIngredients(ingredientSearch, ingredientPage, ingredientPageSize);
    }
    // eslint-disable-next-line
  }, [showIngredientModal, ingredientPage, ingredientPageSize]);

  const openModal = (planIdx, mealIdx) => {
    setModalMeal({ planIdx, mealIdx });
    setShowIngredientModal(true);
    setSelectedIngredient(null);
    setIngredientQuantity('');
    setIngredientUnit('g');
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient({
      id: ingredient.id,
      name: ingredient.name,
      calories: ingredient.calories,
      protein: ingredient.protein,
      fat: ingredient.fat,
      carbohydrates: ingredient.carbohydrates,
      sugar: ingredient.sugar
    });
    setShowIngredientModal(false);
  };

  const handleIngredientSearch = (e) => {
    setIngredientSearch(e.target.value);
    setIngredientPage(1);
    fetchIngredients(e.target.value, 1, ingredientPageSize);
  };

  const handleIngredientPageChange = (newPage) => {
    setIngredientPage(newPage);
    fetchIngredients(ingredientSearch, newPage, ingredientPageSize);
  };

  const handleIngredientPageSizeChange = (e) => {
    setIngredientPageSize(Number(e.target.value));
    setIngredientPage(1);
    fetchIngredients(ingredientSearch, 1, Number(e.target.value));
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient || !ingredientQuantity) return;
    setIngredientsByPlan(prev => {
      const updated = { ...prev };
      if (!updated[modalMeal.planIdx]) updated[modalMeal.planIdx] = {};
      if (!updated[modalMeal.planIdx][modalMeal.mealIdx]) updated[modalMeal.planIdx][modalMeal.mealIdx] = [];
      const mealArr = updated[modalMeal.planIdx][modalMeal.mealIdx];
      const existingIdx = mealArr.findIndex(ing => ing.id === selectedIngredient.id);
      if (existingIdx !== -1) {
        mealArr[existingIdx] = {
          ...selectedIngredient,
          quantity: ingredientQuantity,
          unit: ingredientUnit
        };
      } else {
        mealArr.push({
          ...selectedIngredient,
          quantity: ingredientQuantity,
          unit: ingredientUnit
        });
      }
      return updated;
    });
    setSelectedIngredient(null);
    setIngredientQuantity('');
    setIngredientUnit('g');
    setModalMeal(null);
  };

  const handleRemoveIngredient = (planIdx, mealIdx, ingId) => {
    setIngredientsByPlan(prev => {
      const updated = { ...prev };
      if (!updated[planIdx]) updated[planIdx] = {};
      if (!updated[planIdx][mealIdx]) updated[planIdx][mealIdx] = [];
      updated[planIdx][mealIdx] = updated[planIdx][mealIdx].filter(ing => ing.id !== ingId);
      return updated;
    });
  };

  const handleQuantityChange = (planIdx, mealIdx, ingId, value) => {
    setIngredientsByPlan(prev => {
      const updated = { ...prev };
      if (!updated[planIdx]) updated[planIdx] = {};
      if (!updated[planIdx][mealIdx]) updated[planIdx][mealIdx] = [];
      updated[planIdx][mealIdx] = updated[planIdx][mealIdx].map(ing =>
        ing.id === ingId ? { ...ing, quantity: value } : ing
      );
      return updated;
    });
  };

  // Guardar toda la tabla comparativa (PUT/POST global)
  const handleSaveTable = async () => {
    if (!tableId) {
      alert('No se puede guardar: falta el ID de la tabla comparativa.');
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    // Construye la estructura para el backend
    const comparative_plans = comparativePlans.map((plan, planIdx) => ({
      id: plan.id,
      name: plan.name,
      order: plan.order,
      description: plan.description,
      meals: Object.keys(ingredientsByPlan[planIdx] || {}).map(mealIdx => ({
        meal_number: Number(mealIdx) + 1,
        name: DEFAULT_MEALS[mealIdx],
        time: DEFAULT_TIMES[mealIdx] || '08:00',
        ingredients: (ingredientsByPlan[planIdx][mealIdx] || []).map(ing => ({
          ingredient: ing.id,
          quantity: ing.quantity,
          unit: ing.unit
        }))
      }))
    }));
    try {
      await axios.put(`${apiUrl}/nutrition/comparative-tables/${tableId}/`, {
        user: userId,
        comparative_plans
      }, {
        headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
      });
      alert('Tabla comparativa guardada correctamente.');
    } catch (error) {
      let msg = 'Error al guardar la tabla comparativa.';
      if (error.response && error.response.data) {
        msg += '\n' + JSON.stringify(error.response.data);
      }
      alert(msg);
      console.error(error);
    }
  };

  return (
    <div className="meal-table-container">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Comida</th>
            {comparativePlans.map((plan, planIdx) => (
              <th key={planIdx}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEFAULT_MEALS.map((meal, mealIdx) => (
            <tr key={mealIdx}>
              <td>{meal}</td>
              {comparativePlans.map((plan, planIdx) => (
                <td key={planIdx}>
                  <button
                    onClick={() => openModal(planIdx, mealIdx)}
                    className="btn btn-success btn-block mb-2"
                  >
                    + Añadir Ingrediente
                  </button>
                  <ul className="ingredient-list">
                    {(ingredientsByPlan[planIdx]?.[mealIdx] || []).map(ing => (
                      <li key={ing.id} className="ingredient-item">
                        <span style={{ flex: 1, fontWeight: 500, color: '#fff' }}>{ing.name}</span>
                        <span style={{ marginRight: 8, color: '#bbb' }}>
                          <input
                            type="number"
                            min="1"
                            value={ing.quantity}
                            style={{ width: 60, display: 'inline-block', marginRight: 4, borderRadius: 4, border: '1px solid #888', background: '#181a1b', color: '#fff', padding: '2px 6px' }}
                            onChange={e => handleQuantityChange(planIdx, mealIdx, ing.id, e.target.value)}
                          />
                          {ing.unit}
                        </span>
                        <button
                          onClick={() => handleRemoveIngredient(planIdx, mealIdx, ing.id)}
                          className="btn btn-danger btn-sm ml-2"
                          style={{ fontSize: 13, padding: '2px 10px', borderRadius: 4 }}
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Totales Nutricionales</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Calorías</th>
            <th>Proteínas</th>
            <th>Grasas</th>
            <th>Carbohidratos</th>
            <th>Azúcares</th>
          </tr>
        </thead>
        <tbody>
          {comparativePlans.map((plan, planIdx) => {
            const totals = nutritionTotals[planIdx] || { calories: 0, protein: 0, fat: 0, carbohydrates: 0, sugar: 0 };
            return (
              <tr key={planIdx}>
                <td>{plan.name}</td>
                <td>{totals.calories.toFixed(2)}</td>
                <td>{totals.protein.toFixed(2)}g</td>
                <td>{totals.fat.toFixed(2)}g</td>
                <td>{totals.carbohydrates.toFixed(2)}g</td>
                <td>{totals.sugar.toFixed(2)}g</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSaveTable} className="btn btn-primary">
        Guardar y Asignar Tabla Comparativa
      </button>
      {modalMeal && (
        <div className="comparative-modal-backdrop" onClick={() => setModalMeal(null)}>
          <div className="comparative-modal" onClick={e => e.stopPropagation()}>
            <h3>Añadir Ingrediente</h3>
            <IngredientModal
              show={showIngredientModal}
              onClose={() => setShowIngredientModal(false)}
              onIngredientSelect={handleIngredientSelect}
              ingredients={ingredientResults}
              searchValue={ingredientSearch}
              onSearch={handleIngredientSearch}
              page={ingredientPage}
              totalPages={ingredientTotalPages}
              totalCount={ingredientTotalCount}
              onPageChange={handleIngredientPageChange}
              pageSize={ingredientPageSize}
              onPageSizeChange={handleIngredientPageSizeChange}
            />
            {selectedIngredient && (
              <>
                <div style={{ marginBottom: 8, color: '#fff', fontWeight: 500 }}>
                  {selectedIngredient.name}
                </div>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Cantidad"
                  value={ingredientQuantity}
                  onChange={e => setIngredientQuantity(e.target.value)}
                />
                <select
                  className="form-control mb-2"
                  value={ingredientUnit}
                  onChange={e => setIngredientUnit(e.target.value)}
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="unidad">unidad</option>
                </select>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="btn btn-success" onClick={handleAddIngredient}>
                    Añadir
                  </button>
                  <button className="btn btn-secondary" onClick={() => setModalMeal(null)}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativeMealTable; 