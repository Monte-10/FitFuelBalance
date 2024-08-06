import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ManageDailyDiet.css';

function ManageDailyDiet() {
  const { dietId } = useParams();
  const [dietName, setDietName] = useState('');
  const [dailyDiets, setDailyDiets] = useState([]);
  const [currentDayPage, setCurrentDayPage] = useState(0);
  const [currentMealPage, setCurrentMealPage] = useState(0);
  const [totalMealPages, setTotalMealPages] = useState(0);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [mealFilters, setMealFilters] = useState({
    name: '',
    minCalories: '',
    maxCalories: '',
    minProtein: '',
    maxProtein: '',
    minCarbohydrates: '',
    maxCarbohydrates: '',
    minFat: '',
    maxFat: '',
    minSugar: '',
    maxSugar: '',
    minFiber: '',
    maxFiber: '',
    minSaturatedFat: '',
    maxSaturatedFat: '',
  });

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDailyDiets = async () => {
      try {
        const response = await fetch(`${apiUrl}/nutrition/diet/${dietId}/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch daily diets');
        const data = await response.json();
        setDailyDiets(data.daily_diets || []);
        setDietName(data.name);
        const mealsSelection = {};
        data.daily_diets.forEach(dd => {
          mealsSelection[dd.date] = dd.meals.map(m => m.id); // Ensure this is always an array
        });
        setSelectedMeals(mealsSelection);
      } catch (error) {
        console.error('Error fetching daily diets:', error);
      }
    };

    fetchDailyDiets();
  }, [dietId, apiUrl]);

  const fetchMeals = async (page = 0, filters = mealFilters) => {
    setLoadingMeals(true);
    try {
      const filterParams = new URLSearchParams({
        ...filters,
        page: page + 1,
        page_size: itemsPerPage,
      }).toString();
      const response = await fetch(`${apiUrl}/nutrition/meals/?${filterParams}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch meals');
      const data = await response.json();
      setMeals(data.results);
      setTotalMealPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoadingMeals(false);
    }
  };

  useEffect(() => {
    fetchMeals(currentMealPage, mealFilters);
  }, [currentMealPage, mealFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setMealFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentMealPage(0); // Reset meal page to 0 when filters change
  };

  const handleMealSelection = (mealId, date) => {
    setSelectedMeals(prev => {
      const updatedMealsForDate = prev[date] ? [...prev[date]] : [];
      if (!updatedMealsForDate.includes(mealId)) {
        updatedMealsForDate.push(mealId);
      }
      return { ...prev, [date]: updatedMealsForDate };
    });
  };

  const handleMealRemoval = (mealId, date) => {
    setSelectedMeals(prev => {
      const updatedMealsForDate = prev[date] ? prev[date].filter(id => id !== mealId) : [];
      return { ...prev, [date]: updatedMealsForDate };
    });
  };

  const handleDayPageChange = (index) => {
    setCurrentDayPage(index);
    setCurrentMealPage(0); // Reset meal page to 0 when changing day page
  };

  const handleMealPageChange = (index) => {
    setCurrentMealPage(index);
  };

  const saveDailyDiet = async () => {
    const dailyDiet = dailyDiets[currentDayPage];
    if (!dailyDiet) {
      alert('No se encontró el Daily Diet para la página actual');
      return;
    }

    const mealIds = selectedMeals[dailyDiet.date] || [];

    try {
      const response = await fetch(`${apiUrl}/nutrition/daily_diets/${dailyDiet.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('authToken') || '',
        },
        body: JSON.stringify({ meals: mealIds }),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorDetail.detail}`);
      }

      alert('Dieta diaria actualizada con éxito!');
    } catch (error) {
      console.error('Error saving daily diet:', error);
      alert('Error al guardar la dieta diaria: ' + error.message);
    }
  };

  const displayedMeals = meals;

  return (
    <div className="manage-daily-diet-container mt-4">
      <h2>Administrar Dieta Diaria para la Dieta: {dietName}</h2>
      <div className="mb-3">
        <button className="btn btn-secondary mr-2" onClick={() => handleDayPageChange(Math.max(0, currentDayPage - 1))}>Anterior Día</button>
        <button className="btn btn-secondary" onClick={() => handleDayPageChange(Math.min(dailyDiets.length - 1, currentDayPage + 1))}>Siguiente Día</button>
      </div>

      {dailyDiets.length > 0 && (
        <div>
          <h3>Día: {dailyDiets[currentDayPage].date}</h3>
          <div className="row mb-4">
            {Object.keys(mealFilters).map((filter) => (
              <div key={filter} className="col-md-4">
                <input
                  type={filter.includes('Calories') || filter.includes('Protein') || filter.includes('Fat') || filter.includes('Sugar') || filter.includes('Fiber') || filter.includes('SaturatedFat') ? "number" : "text"}
                  className="form-control mb-2"
                  placeholder={filter}
                  value={mealFilters[filter]}
                  onChange={handleFilterChange}
                  name={filter}
                />
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4>Comidas Disponibles</h4>
              {loadingMeals ? (
                <p>Cargando comidas...</p>
              ) : (
                displayedMeals.map(meal => (
                  <div key={meal.id} className="card mb-2">
                    <div className="card-body">
                      <h5 className="card-title">{meal.name} - {meal.calories} Calorías</h5>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleMealSelection(meal.id, dailyDiets[currentDayPage].date)}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-secondary mx-2" onClick={() => handleMealPageChange(Math.max(0, currentMealPage - 1))}>Anterior Página de Comidas</button>
                <button className="btn btn-secondary mx-2" onClick={() => handleMealPageChange(Math.min(totalMealPages - 1, currentMealPage + 1))}>Siguiente Página de Comidas</button>
              </div>
            </div>

            <div className="col-md-6">
              <h4>Comidas Seleccionadas</h4>
              <ul className="list-group">
                {selectedMeals[dailyDiets[currentDayPage].date]?.map((mealId, index) => {
                  const meal = meals.find(m => m.id === mealId);
                  return (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {meal?.name}
                      <button className="btn btn-warning btn-sm" onClick={() => handleMealRemoval(mealId, dailyDiets[currentDayPage].date)}>Quitar</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center mt-3">
              <button className="btn btn-success" onClick={saveDailyDiet}>Guardar cambios para este día</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDailyDiet;
