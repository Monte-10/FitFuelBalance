import React, { useState, useEffect } from 'react';

function CreateIngredient() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(''); // Podrías considerar inicializarlo con el primer valor de 'foods' después de cargarlos
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [ingredientCreated, setIngredientCreated] = useState(false);
  const [createdIngredientId, setCreatedIngredientId] = useState(null);

  useEffect(() => {
    fetch('${apiUrl}/nutrition/foods/')
      .then(response => response.json())
      .then(data => {
        setFoods(data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFood) {
      alert("Por favor, selecciona un alimento.");
      return;
    }
    
    const ingredientData = {
      name: name,
      food: selectedFood, // Asegúrate de que este valor sea un string que represente el ID del alimento
      quantity: quantity,
    };

    console.log("Sending ingredient data", ingredientData);
    
    fetch('${apiUrl}/nutrition/ingredients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setIngredientCreated(true);
      setCreatedIngredientId(data.id); // Asume que tu API devuelve el ID del ingrediente creado
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      {ingredientCreated ? (
        <div>
          <p>El Ingrediente se ha creado correctamente.</p>
          <a href={`/ingredients/${createdIngredientId}`}>Ir a verlo</a> {/* Ajusta esta URL según tu enrutamiento */}
          <button onClick={() => setIngredientCreated(false)}>Crear uno nuevo</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del Ingrediente:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Food:
            <select value={selectedFood} onChange={e => setSelectedFood(e.target.value)}>
              <option value="">Seleccione un alimento</option>
              {foods.map(food => (
                <option key={food.id} value={food.id}>{food.name}</option>
              ))}
            </select>
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </label>
          <button type="submit">Crear Ingrediente</button>
        </form>
      )}
    </div>
  );
}

export default CreateIngredient;
