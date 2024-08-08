// CreatePlan.js

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlan.css';

const CreatePlan = () => {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState('');
  const [mealNumber, setMealNumber] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitBased, setUnitBased] = useState(false);

  const handleAddMeal = () => {
    setMeals([...meals, { mealName, mealNumber, ingredients: [] }]);
    setMealName('');
    setMealNumber('');
  };

  const handleAddIngredient = (mealIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients = [
      ...(updatedMeals[mealIndex].ingredients || []),
      { ingredientName, quantity, unitBased }
    ];
    setMeals(updatedMeals);
    setIngredientName('');
    setQuantity('');
    setUnitBased(false);
  };

  const handleSubmit = () => {
    // Submit the plan with meals and ingredients
    const planData = {
      name: planName,
      start_date: startDate,
      end_date: endDate,
      custom_meals: meals.map((meal, index) => ({
        meal_number: meal.mealNumber,
        name: meal.mealName,
        ingredients: meal.ingredients.map(ingredient => ({
          ingredient: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unit_based: ingredient.unitBased,
        }))
      }))
    };

    fetch('/api/plans/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(planData)
    })
    .then(response => response.json())
    .then(data => {
      toast.success('Plan created successfully!');
      setPlanName('');
      setStartDate('');
      setEndDate('');
      setMeals([]);
    })
    .catch(error => {
      console.error('Error creating plan:', error);
      toast.error('Error creating plan');
    });
  };

  return (
    <div className="container mt-4 create-plan-container">
      <h2>Create Plan</h2>
      <ToastContainer />
      <div className="form-group mb-3">
        <label htmlFor="planName">Plan Name:</label>
        <input
          type="text"
          className="form-control"
          id="planName"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button onClick={handleSubmit} className="btn btn-primary">Create Plan</button>

      <h2>Add Meal</h2>
      <div className="form-group mb-3">
        <label htmlFor="mealName">Meal Name:</label>
        <input
          type="text"
          className="form-control"
          id="mealName"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="mealNumber">Meal Number:</label>
        <input
          type="number"
          className="form-control"
          id="mealNumber"
          value={mealNumber}
          onChange={(e) => setMealNumber(e.target.value)}
          required
        />
      </div>
      <button onClick={handleAddMeal} className="btn btn-secondary">Add Meal</button>

      {meals.map((meal, index) => (
        <div key={index} className="meal-section">
          <h3>{meal.mealName} (Meal {meal.mealNumber})</h3>
          <div className="form-group mb-3">
            <label htmlFor="ingredientName">Ingredient Name:</label>
            <input
              type="text"
              className="form-control"
              id="ingredientName"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>
              Unit Based:
              <input
                type="checkbox"
                checked={unitBased}
                onChange={(e) => setUnitBased(e.target.checked)}
              />
            </label>
          </div>
          <button onClick={() => handleAddIngredient(index)} className="btn btn-secondary">Add Ingredient</button>

          <ul className="ingredient-list">
            {meal.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient.ingredientName} - {ingredient.quantity} {ingredient.unitBased ? 'units' : 'grams'}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CreatePlan;
