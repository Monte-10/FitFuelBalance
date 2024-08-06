import React, { useState, useEffect } from 'react';

function CreateMeal() {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([{
    dishId: '',
    portion: '',
    notes: ''
  }]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [mealCreated, setMealCreated] = useState(false);
  const [createdMealId, setCreatedMealId] = useState(null);

  useEffect(() => {
    fetch('${apiUrl}/nutrition/dishes/')
      .then(response => response.json())
      .then(data => {
        setDishes(data);
      });

    fetch('${apiUrl}/user/regularusers/')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id.toString()); // Inicializa con el primer usuario, si existe
        }
      });
  }, []);

  const handleDishChange = (index, field, value) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes[index][field] = value;
    setSelectedDishes(newSelectedDishes);
  };

  const addDishField = () => {
    setSelectedDishes([...selectedDishes, { dishId: '', portion: '', notes: '' }]);
  };

  const removeDishField = (index) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes.splice(index, 1);
    setSelectedDishes(newSelectedDishes);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const mealData = {
      name,
      user: selectedUser,
      dishes_data: selectedDishes.map(sd => ({
        dish: sd.dishId,
        portion: sd.portion,
        notes: sd.notes
      }))
    };

    console.log("Sending meal data", mealData);

    fetch('${apiUrl}/nutrition/meals/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setMealCreated(true);
      setCreatedMealId(data.id); // Asume que la respuesta de la API incluye el ID de la comida creada
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      {mealCreated ? (
        <div>
          <p>La Comida se ha creado correctamente.</p>
          <a href={`/meals/${createdMealId}`}>Ver Comida</a>
          <button onClick={() => setMealCreated(false)}>Crear otra Comida</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la Comida:
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
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </label>
          {selectedDishes.map((dish, index) => (
            <div key={index}>
              <select value={dish.dishId} onChange={e => handleDishChange(index, 'dishId', e.target.value)}>
                <option value="">Seleccione un Plato</option>
                {dishes.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={dish.portion}
                onChange={e => handleDishChange(index, 'portion', e.target.value)}
                placeholder="Porción"
              />
              <input
                type="text"
                value={dish.notes}
                onChange={e => handleDishChange(index, 'notes', e.target.value)}
                placeholder="Notas (opcional)"
              />
              <button type="button" onClick={() => removeDishField(index)}>Eliminar Plato</button>
            </div>
          ))}
          <button type="button" onClick={addDishField}>Añadir Plato</button>
          <button type="submit">Crear Comida</button>
        </form>
      )}
    </div>
  );
}

export default CreateMeal;
