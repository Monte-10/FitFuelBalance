import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateDish.css'; // Importa el archivo CSS

function CreateDish() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6); // Ajustado para mostrar más ingredientes por página
  const [totalPages, setTotalPages] = useState(0);
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
    gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
    contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
    cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
    legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
    special_drink_or_supplement: false, tuber: false, other: false
  });
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [dishCreated, setDishCreated] = useState(false);
  const [createdDishId, setCreatedDishId] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
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
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchIngredients(currentPage, filters);
    fetchUsers();
  }, [apiUrl, currentPage, filters]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/regularusers/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      const data = await response.json();
      setUsers(data.results || []);
      if (data.results && data.results.length > 0) {
        setSelectedUser(data.results[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchIngredients = (page, filters) => {
    const queryParams = new URLSearchParams({
      page: page + 1,
      page_size: itemsPerPage,
      name: filters.name,
      calories__gte: filters.minCalories,
      calories__lte: filters.maxCalories,
      protein__gte: filters.minProtein,
      protein__lte: filters.maxProtein,
      carbohydrates__gte: filters.minCarbohydrates,
      carbohydrates__lte: filters.maxCarbohydrates,
      fat__gte: filters.minFat,
      fat__lte: filters.maxFat,
      sugar__gte: filters.minSugar,
      sugar__lte: filters.maxSugar,
      fiber__gte: filters.minFiber,
      fiber__lte: filters.maxFiber,
      saturated_fat__gte: filters.minSaturatedFat,
      saturated_fat__lte: filters.maxSaturatedFat,
    });

    fetch(`${apiUrl}/nutrition/ingredients/?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setIngredients(data.results);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      });
  };

  useEffect(() => {
    const totals = selectedIngredients.reduce((acc, { ingredientId, quantity }) => {
      const ingredient = ingredients.find(ing => ing.id.toString() === ingredientId);
      if (ingredient && quantity) {
        acc.calories += ingredient.calories * quantity;
        acc.protein += ingredient.protein * quantity;
        acc.carbohydrates += ingredient.carbohydrates * quantity;
        acc.fat += ingredient.fat * quantity;
        acc.sugar += ingredient.sugar * quantity;
        acc.fiber += ingredient.fiber * quantity;
        acc.saturated_fat += ingredient.saturated_fat * quantity;
        acc.gluten_free = acc.gluten_free && ingredient.gluten_free;
        acc.lactose_free = acc.lactose_free && ingredient.lactose_free;
        acc.vegan = acc.vegan && ingredient.vegan;
        acc.vegetarian = acc.vegetarian && ingredient.vegetarian;
        acc.pescetarian = acc.pescetarian && ingredient.pescetarian;
        acc.contains_meat = acc.contains_meat || ingredient.contains_meat;
        acc.contains_vegetables = acc.contains_vegetables || ingredient.contains_vegetables;
        acc.contains_fish_shellfish_canned_preserved = acc.contains_fish_shellfish_canned_preserved || ingredient.contains_fish_shellfish_canned_preserved;
        acc.cereal = acc.cereal || ingredient.cereal;
        acc.pasta_or_rice = acc.pasta_or_rice || ingredient.pasta_or_rice;
        acc.dairy_yogurt_cheese = acc.dairy_yogurt_cheese || ingredient.dairy_yogurt_cheese;
        acc.fruit = acc.fruit || ingredient.fruit;
        acc.nuts = acc.nuts || ingredient.nuts;
        acc.legume = acc.legume || ingredient.legume;
        acc.sauce_or_condiment = acc.sauce_or_condiment || ingredient.sauce_or_condiment;
        acc.deli_meat = acc.deli_meat || ingredient.deli_meat;
        acc.bread_or_toast = acc.bread_or_toast || ingredient.bread_or_toast;
        acc.egg = acc.egg || ingredient.egg;
        acc.special_drink_or_supplement = acc.special_drink_or_supplement || ingredient.special_drink_or_supplement;
        acc.tuber = acc.tuber || ingredient.tuber;
        acc.other = acc.other || ingredient.other;
      }
      return acc;
    }, {
      calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
      gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
      contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
      cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
      legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
      special_drink_or_supplement: false, tuber: false, other: false
    });

    setNutritionTotals(totals);
  }, [selectedIngredients, ingredients]);

  const handleFilterChange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleIngredientToggle = (ingredientId) => {
    const existingIndex = selectedIngredients.findIndex(item => item.ingredientId === ingredientId.toString());

    if (existingIndex >= 0) {
      // Ingrediente ya añadido, quitarlo
      const newIngredients = selectedIngredients.filter((_, idx) => idx !== existingIndex);
      setSelectedIngredients(newIngredients);
    } else {
      // Añadir nuevo ingrediente
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (ingredient) {
        setSelectedIngredients([...selectedIngredients, {
          ingredientId: ingredient.id.toString(),
          quantity: 1,
          name: ingredient.name
        }]);
      }
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedIngredients = selectedIngredients.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setSelectedIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = selectedIngredients.filter((_, idx) => idx !== index);
    setSelectedIngredients(updatedIngredients);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const currentIngredients = ingredients.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dishData = {
      name,
      user: parseInt(selectedUser, 10),  // Asegura que el ID de usuario es un entero
      ingredients: selectedIngredients.map(si => ({
        ingredient: si.ingredientId,
        quantity: si.quantity,
      })),
    };

    console.log('Dish Data:', dishData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/dishes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(dishData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtén más detalles sobre el error
        console.error('Response error:', errorData); // Muestra el mensaje de error del servidor
        alert(`Error: ${JSON.stringify(errorData)}`); // Muestra un mensaje de error al usuario
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dish created successfully:', data);
      setDishCreated(true);
      toast.success('Plato creado exitosamente!');
      setCreatedDishId(data.id);
      setName('');
      setSelectedUser('');
      setSelectedIngredients([]);
    } catch (error) {
      console.error('Error creating dish:', error.message);
      toast.error('Error al crear el plato');
    }
  };

  return (
    <div className="container mt-4 create-dish-container">
      <h2 className="mb-4">Crear Plato</h2>
      <ToastContainer />
      {dishCreated && (
        <div className="alert alert-success" role="alert">
          Plato creado con éxito. ID: {createdDishId}
        </div>
      )}
      <div className="form-group mb-3">
        <label htmlFor="dishName">Nombre del Plato:</label>
        <input
          type="text"
          className="form-control"
          id="dishName"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Introduce el nombre del plato"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="userSelect">Seleccionar Usuario:</label>
        <select
          className="form-control"
          id="userSelect"
          name="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      {!dishCreated && (
        <form onSubmit={handleSubmit}>
          <h3>Filtros para Ingredientes</h3>
          <div className="row">
            <div className="mb-3">
              <label htmlFor="filterName" className="form-label">Nombre del Alimento</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar por nombre"
                value={filters.name}
                onChange={handleFilterChange}
                name="name"
              />
            </div>
            <button type="button" className="btn btn-info mb-3" onClick={toggleAdvancedFilters}>
              {showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}
            </button>
            {showAdvancedFilters && (
              <>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="filterMinCalories" className="form-label">Mínimo de Calorías</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Calorías Mínimas"
                      value={filters.minCalories}
                      onChange={handleFilterChange}
                      name="minCalories"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxCalories" className="form-label">Máximo de Calorías</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Calorías Máximas"
                      value={filters.maxCalories}
                      onChange={handleFilterChange}
                      name="maxCalories"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMinProtein" className="form-label">Mínimo de Proteínas</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Proteínas Mínimas"
                      value={filters.minProtein}
                      onChange={handleFilterChange}
                      name="minProtein"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxProtein" className="form-label">Máximo de Proteínas</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Proteínas Máximas"
                      value={filters.maxProtein}
                      onChange={handleFilterChange}
                      name="maxProtein"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="filterMinCarbohydrates" className="form-label">Mínimo de Carbohidratos</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Carbohidratos Mínimos"
                      value={filters.minCarbohydrates}
                      onChange={handleFilterChange}
                      name="minCarbohydrates"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxCarbohydrates" className="form-label">Máximo de Carbohidratos</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Carbohidratos Máximos"
                      value={filters.maxCarbohydrates}
                      onChange={handleFilterChange}
                      name="maxCarbohydrates"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMinFat" className="form-label">Mínimo de Grasas</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Grasas Mínimas"
                      value={filters.minFat}
                      onChange={handleFilterChange}
                      name="minFat"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxFat" className="form-label">Máximo de Grasas</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Grasas Máximas"
                      value={filters.maxFat}
                      onChange={handleFilterChange}
                      name="maxFat"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="filterMinSugar" className="form-label">Mínimo de Azúcares</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Azúcares Mínimos"
                      value={filters.minSugar}
                      onChange={handleFilterChange}
                      name="minSugar"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxSugar" className="form-label">Máximo de Azúcares</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Azúcares Máximos"
                      value={filters.maxSugar}
                      onChange={handleFilterChange}
                      name="maxSugar"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMinFiber" className="form-label">Mínimo de Fibra</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Fibra Mínima"
                      value={filters.minFiber}
                      onChange={handleFilterChange}
                      name="minFiber"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filterMaxFiber" className="form-label">Máximo de Fibra</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Fibra Máxima"
                      value={filters.maxFiber}
                      onChange={handleFilterChange}
                      name="maxFiber"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="ingredient-list mt-3">
            <div className="row">
              <div className="col-md-6">
                <h3>Ingredientes Disponibles</h3>
                <div className="row">
                  {currentIngredients.map((ingredient) => (
                    <div key={ingredient.id} className="col-md-6">
                      <div className="card mb-2">
                        <div className="card-body">
                          {ingredient.food_image && (
                            <img
                              src={ingredient.food_image}
                              className="card-img-top"
                              alt={ingredient.name}
                              style={{ maxWidth: '100px', marginBottom: '10px' }}
                            />
                          )}
                          <h5 className="card-title">{ingredient.name}</h5>
                          <button
                            type="button"
                            className={selectedIngredients.some(item => item.ingredientId === ingredient.id.toString()) ? "btn btn-danger" : "btn btn-primary"}
                            onClick={() => handleIngredientToggle(ingredient.id)}
                          >
                            {selectedIngredients.some(item => item.ingredientId === ingredient.id.toString()) ? "Quitar" : "Añadir"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h3>Ingredientes Seleccionados</h3>
                {selectedIngredients.map((item, index) => {
                  const ingredient = ingredients.find(ing => ing.id.toString() === item.ingredientId);
                  return (
                    <div key={index} className="input-group mb-3">
                      <input
                        type="text"
                        readOnly
                        className="form-control"
                        value={item.name}
                      />
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        min="0.01"
                        step="0.01"
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          Quitar
                        </button>
                      </div>
                      {ingredient && (
                        <div className="ingredient-summary">
                          <small>
                            Cal: {ingredient.calories.toFixed(2)} | Prot: {ingredient.protein.toFixed(2)}g | Carb: {ingredient.carbohydrates.toFixed(2)}g | Grasa: {ingredient.fat.toFixed(2)}g
                          </small>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="pagination" style={{ marginBottom: '20px' }}>
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn btn-secondary"
              type="button"
            >
              Anterior
            </button>
            <span> Página {currentPage + 1} de {totalPages} </span>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn btn-secondary"
              type="button"
            >
              Siguiente
            </button>
          </div>

          <div className="d-flex justify-content-between" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">Crear Plato</button>
          </div>

        </form>
      )}

      <div className="card mt-4">
        <div className="card-header">
          Totales Nutricionales
        </div>
        <div className="row">
          {/* Columna 1 */}
          <div className="col-md-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Calorías: {nutritionTotals.calories.toFixed(2)}</li>
              <li className="list-group-item">Proteínas: {nutritionTotals.protein.toFixed(2)}g</li>
              <li className="list-group-item">Carbohidratos: {nutritionTotals.carbohydrates.toFixed(2)}g</li>
              <li className="list-group-item">Grasas: {nutritionTotals.fat.toFixed(2)}g</li>
              <li className="list-group-item">Azúcares: {nutritionTotals.sugar.toFixed(2)}g</li>
              <li className="list-group-item">Fibra: {nutritionTotals.fiber.toFixed(2)}g</li>
              <li className="list-group-item">Grasas Saturadas: {nutritionTotals.saturated_fat.toFixed(2)}g</li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div className="col-md-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Libre de Gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Libre de Lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Contiene Carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Contiene Vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}</li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="col-md-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Contiene Pescado/Mariscos: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Pasta o Arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Lácteos (Yogur, Queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Fruta: {nutritionTotals.fruit ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Frutos Secos: {nutritionTotals.nuts ? 'Sí' : 'No'}</li>
              <li className="list-group-item">Legumbres: {nutritionTotals.legume ? 'Sí' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDish;
