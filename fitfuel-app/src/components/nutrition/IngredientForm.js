import React, { useState, useEffect } from 'react';

const IngredientForm = ({ day, meal, onSave, onCancel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`${process.env.REACT_APP_API_URL}/nutrition/ingredients/search?q=${searchQuery}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => response.json())
      .then(data => setSearchResults(data));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSave = () => {
    if (selectedIngredient && quantity) {
      onSave({ ...selectedIngredient, quantity });
    }
  };

  return (
    <div className="ingredient-form">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search ingredients"
      />
      <ul>
        {searchResults.map(ingredient => (
          <li key={ingredient.id} onClick={() => setSelectedIngredient(ingredient)}>
            {ingredient.name} - {ingredient.calories} cal
          </li>
        ))}
      </ul>
      {selectedIngredient && (
        <div>
          <p>{selectedIngredient.name}</p>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
        </div>
      )}
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default IngredientForm;
