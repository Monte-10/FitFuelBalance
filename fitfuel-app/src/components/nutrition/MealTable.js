import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';

const MealTable = ({ planId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({});

  // Abrir el modal de ingredientes
  const openModal = (day, meal) => {
    setShowModal({ day, meal });
  };

  // Agregar ingrediente seleccionado al día/meal correspondiente
  const handleIngredientSelect = (ingredient) => {
    const { day, meal } = showModal;
    setSelectedIngredients((prev) => {
      const dayIngredients = prev[day] || {};
      const mealIngredients = dayIngredients[meal] || [];
      return {
        ...prev,
        [day]: {
          ...dayIngredients,
          [meal]: [...mealIngredients, { ...ingredient, quantity: 100 }]  // Establece la cantidad inicial
        }
      };
    });
    setShowModal(false);
  };

  // Calcular totales nutricionales por día
  useEffect(() => {
    const totals = {};
    Object.keys(selectedIngredients).forEach((day) => {
      const dayTotals = { calories: 0, fat: 0, saturated_fat: 0, protein: 0, carbohydrates: 0, sugar: 0 };
      Object.values(selectedIngredients[day]).forEach((meal) => {
        meal.forEach((ingredient) => {
          dayTotals.calories += ingredient.calories * (ingredient.quantity / 100);
          dayTotals.fat += ingredient.fat * (ingredient.quantity / 100);
          dayTotals.saturated_fat += ingredient.saturated_fat * (ingredient.quantity / 100);
          dayTotals.protein += ingredient.protein * (ingredient.quantity / 100);
          dayTotals.carbohydrates += ingredient.carbohydrates * (ingredient.quantity / 100);
          dayTotals.sugar += ingredient.sugar * (ingredient.quantity / 100);
        });
      });
      totals[day] = dayTotals;
    });
    setNutritionTotals(totals);
  }, [selectedIngredients]);

  return (
    <div className="meal-table-container">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Día</th>
            <th>Desayuno</th>
            <th>Almuerzo</th>
            <th>Cena</th>
            <th>Extras</th>
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {['Desayuno', 'Almuerzo', 'Cena', 'Extras'].map((meal) => (
                <td key={meal}>
                  <button onClick={() => openModal(day, meal)} className="btn btn-success btn-block mb-2">
                    + Añadir Ingrediente
                  </button>

                  {/* Mostrar ingredientes seleccionados */}
                  {selectedIngredients[day] && selectedIngredients[day][meal] && (
                    <ul className="ingredient-list">
                      {selectedIngredients[day][meal].map((ingredient) => (
                        <li key={ingredient.id} className="ingredient-item">
                          {ingredient.name} ({ingredient.quantity}g)
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales Nutricionales por día */}
      <h3>Totales Nutricionales</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Día</th>
            <th>Calorías</th>
            <th>Grasas</th>
            <th>Grasas Saturadas</th>
            <th>Proteínas</th>
            <th>Carbohidratos</th>
            <th>Azúcares</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(nutritionTotals).map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>{nutritionTotals[day].calories.toFixed(2)}</td>
              <td>{nutritionTotals[day].fat.toFixed(2)}g</td>
              <td>{nutritionTotals[day].saturated_fat.toFixed(2)}g</td>
              <td>{nutritionTotals[day].protein.toFixed(2)}g</td>
              <td>{nutritionTotals[day].carbohydrates.toFixed(2)}g</td>
              <td>{nutritionTotals[day].sugar.toFixed(2)}g</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para seleccionar ingredientes */}
      {showModal && (
        <IngredientModal
          show={!!showModal}
          onClose={() => setShowModal(false)}
          onIngredientSelect={handleIngredientSelect}
        />
      )}
    </div>
  );
};

export default MealTable;
