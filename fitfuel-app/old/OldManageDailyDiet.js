import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ManageDailyDiet() {
  const { dietId } = useParams();
  const [dailyDiets, setDailyDiets] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({}); // Ejemplo: { '2024-02-14': [1, 2], '2024-02-15': [3] }

  useEffect(() => {
    // Cargar los DailyDiets para la Dieta actual y las comidas disponibles
    const fetchDailyDiets = async () => {
      try {
        const response = await fetch(`${apiUrl}/nutrition/diet/${dietId}/`);
        if (!response.ok) throw new Error('DailyDiets fetch failed');
        const data = await response.json();
        setDailyDiets(data.daily_diets || []);
        // Inicializar selectedMeals con los meals existentes para cada DailyDiet
        const mealsSelection = {};
        data.daily_diets.forEach(dd => {
          mealsSelection[dd.date] = dd.meals.map(m => m.id);
        });
        setSelectedMeals(mealsSelection);
      } catch (error) {
        console.error('Error loading daily diets:', error);
      }
    };

    const fetchMeals = async () => {
      try {
        const response = await fetch('${apiUrl}/nutrition/meals/');
        if (!response.ok) throw new Error('Meals fetch failed');
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    fetchDailyDiets();
    fetchMeals();
  }, [dietId]);

  const handleMealSelection = (mealId, date) => {
    setSelectedMeals(prevSelectedMeals => {
      const newSelectedMeals = { ...prevSelectedMeals };
      if (newSelectedMeals[date]?.includes(mealId)) {
        newSelectedMeals[date] = newSelectedMeals[date].filter(id => id !== mealId);
      } else {
        newSelectedMeals[date] = [...(newSelectedMeals[date] || []), mealId];
      }
      return newSelectedMeals;
    });
  };

  const saveDailyDietMeals = async (date) => {
    try {
      const dailyDietId = dailyDiets.find(dd => dd.date === date).id;
      const mealsToSave = selectedMeals[date];
      console.log('Saving meals:', mealsToSave);
      const response = await fetch(`${apiUrl}/nutrition/daily_diets/${dailyDietId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meals: mealsToSave }),
      });
      if (!response.ok) throw new Error('Saving meals failed');
      alert('Meals updated successfully!');
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };
  

  return (
    <div>
      <h2>Manage Daily Diet for Diet ID: {dietId}</h2>
      {dailyDiets.map(dailyDiet => (
        <div key={dailyDiet.id}>
          <h3>Daily Diet for Date: {dailyDiet.date}</h3>
          {meals.map(meal => (
            <div key={meal.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedMeals[dailyDiet.date]?.includes(meal.id)}
                  onChange={() => handleMealSelection(meal.id, dailyDiet.date)}
                />
                {meal.name}
              </label>
            </div>
          ))}
          <button onClick={() => saveDailyDietMeals(dailyDiet.date)}>Save Meals for {dailyDiet.date}</button>
        </div>
      ))}
    </div>
  );
}

export default ManageDailyDiet;
