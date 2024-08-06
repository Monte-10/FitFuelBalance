import React, { useState, useEffect } from 'react';

function CreateDayOption() {
  const [name, setName] = useState('');
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: '',
    mid_morning: '',
    lunch: '',
    snack: '',
    dinner: '',
    extras: []
  });
  const [meals, setMeals] = useState([]);
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('${apiUrl}/nutrition/meals/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
      .then(response => response.json())
      .then(data => setMeals(data))
      .catch(error => {
        console.error('Error fetching meals:', error);
        setError('Failed to fetch meals. Please refresh the page.');
      });
  }, []);

  const handleMealChange = (mealType, value) => {
    setSelectedMeals({ ...selectedMeals, [mealType]: value });
  };

  const handleExtrasChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedMeals({ ...selectedMeals, extras: selectedOptions });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const optionData = {
      name,
      ...selectedMeals
    };

    console.log("Sending option day data", optionData);

    fetch('${apiUrl}/nutrition/dayoptions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
      body: JSON.stringify(optionData),
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setOptionCreated(true);
    })
    .catch((error) => {
      console.error('Error creating option:', error);
      setError('Failed to create option. Please try again.');
    });
  };

  return (
    <div>
      {!optionCreated ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Option Name"
            />
            <select value={selectedMeals.breakfast} onChange={(e) => handleMealChange('breakfast', e.target.value)}>
              <option value="">Select Breakfast</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <select value={selectedMeals.mid_morning} onChange={(e) => handleMealChange('mid_morning', e.target.value)}>
              <option value="">Select Mid Morning</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <select value={selectedMeals.lunch} onChange={(e) => handleMealChange('lunch', e.target.value)}>
              <option value="">Select Lunch</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <select value={selectedMeals.snack} onChange={(e) => handleMealChange('snack', e.target.value)}>
              <option value="">Select Snack</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <select value={selectedMeals.dinner} onChange={(e) => handleMealChange('dinner', e.target.value)}>
              <option value="">Select Dinner</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <select multiple value={selectedMeals.extras} onChange={handleExtrasChange}>
              <option value="">Select Extras</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
            <button type="submit">Create Option</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <p>Option created successfully!</p>
      )}
    </div>
  );
}

export default CreateDayOption;
