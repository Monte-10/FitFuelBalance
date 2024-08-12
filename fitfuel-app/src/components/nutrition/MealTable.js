import React, { useState } from 'react';
import IngredientForm from './IngredientForm';

const MealTable = ({ planId }) => {
  const [plan, setPlan] = useState({
    monday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    tuesday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    wednesday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    thursday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    friday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    saturday: { breakfast: [], lunch: [], dinner: [], extras: [] },
    sunday: { breakfast: [], lunch: [], dinner: [], extras: [] },
  });
  const [currentDay, setCurrentDay] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);

  const handleAddIngredientClick = (day, meal) => {
    setCurrentDay(day);
    setCurrentMeal(meal);
  };

  const handleSaveIngredient = (ingredient) => {
    setPlan(prevPlan => ({
      ...prevPlan,
      [currentDay]: {
        ...prevPlan[currentDay],
        [currentMeal]: [...prevPlan[currentDay][currentMeal], ingredient]
      }
    }));
    setCurrentDay(null);
    setCurrentMeal(null);
  };

  const handleRemoveIngredient = (day, meal, index) => {
    const updatedMeal = plan[day][meal].filter((_, i) => i !== index);
    setPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [meal]: updatedMeal
      }
    }));
  };

  const handleSubmit = () => {
    const mealsData = Object.keys(plan).flatMap(day => {
      const meals = plan[day];
      return Object.keys(meals).flatMap(meal => 
        meals[meal].map(ingredient => ({
          plan: planId,
          day: day,
          meal_type: meal,
          ingredient_id: ingredient.id,
          quantity: ingredient.quantity
        }))
      );
    });

    fetch(`${process.env.REACT_APP_API_URL}/nutrition/meals/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(mealsData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Meals added:', data);
    })
    .catch(error => {
      console.error('Error adding meals:', error);
    });
  };

  return (
    <div>
      {currentDay && currentMeal && (
        <IngredientForm
          day={currentDay}
          meal={currentMeal}
          onSave={handleSaveIngredient}
          onCancel={() => {
            setCurrentDay(null);
            setCurrentMeal(null);
          }}
        />
      )}
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
          {Object.keys(plan).map(day => (
            <tr key={day}>
              <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
              {['breakfast', 'lunch', 'dinner', 'extras'].map(meal => (
                <td key={meal}>
                  {plan[day][meal].map((ingredient, index) => (
                    <div key={index}>
                      <span>{ingredient.name} ({ingredient.quantity})</span>
                      <button onClick={() => handleRemoveIngredient(day, meal, index)}>-</button>
                    </div>
                  ))}
                  <button onClick={() => handleAddIngredientClick(day, meal)}>+ Añadir Ingrediente</button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} className="btn btn-primary">Save Meals</button>
    </div>
  );
};

export default MealTable;
