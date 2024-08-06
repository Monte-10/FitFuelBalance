import React, { useState, useEffect } from 'react';

function CreateDish() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([{
    ingredientId: '',
    quantity: ''
  }]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [dishCreated, setDishCreated] = useState(false);
  const [createdDishId, setCreatedDishId] = useState(null);

  useEffect(() => {
    fetch('${apiUrl}/nutrition/ingredients/')
      .then(response => response.json())
      .then(data => {
        setIngredients(data);
      });

  fetch('${apiUrl}/user/regularusers/')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id.toString()); // Opcional: inicializar con el primer usuario
        }
      });
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[index][field] = value;
    setSelectedIngredients(newSelectedIngredients);
  };

  const addIngredientField = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: '' }]);
  };

  const removeIngredientField = (index) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients.splice(index, 1);
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const dishData = {
      name,
      user: selectedUser,
      ingredients: selectedIngredients.map(si => ({
        ingredient: si.ingredientId,
        quantity: si.quantity
      }))
    };

    console.log("Sending dish data", dishData);

    fetch('${apiUrl}/nutrition/dishes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dishData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setDishCreated(true);
      setCreatedDishId(data.id); // Asume que tu API devuelve el ID del plato creado
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      {dishCreated ? (
        <div>
          <p>El Plato se ha creado correctamente.</p>
          <a href={`/dishes/${createdDishId}`}>Ir a verlo</a> {/* Ajusta esta URL según tu enrutamiento */}
          <button onClick={() => setDishCreated(false)}>Crear otro plato</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del Plato:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Usuario:
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                <option value="">Seleccione un usuario</option>
                {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option> // Asumiendo que el objeto user tiene un campo username
                ))}
            </select>
            </label>

          {selectedIngredients.map((ingredient, index) => (
            <div key={index}>
              <select value={ingredient.ingredientId} onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)}>
                <option value="">Seleccione un ingrediente</option>
                {ingredients.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={ingredient.quantity}
                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                placeholder="Cantidad"
              />
              <button type="button" onClick={() => removeIngredientField(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={addIngredientField}>Añadir Ingrediente</button>
          <button type="submit">Crear Plato</button>
        </form>
      )}
    </div>
  );
}

export default CreateDish;
