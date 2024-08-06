import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateMeal.css'; // Importa el archivo CSS

function CreateMeal() {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [mealCreated, setMealCreated] = useState(false);
  const [createdMealId, setCreatedMealId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [itemsPerPage] = useState(6); // Cambiado a 6 para más platos por página
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDishes(currentPage, filters);
  }, [currentPage, filters]);

  const fetchDishes = (page, filters) => {
    const queryParams = new URLSearchParams({
      page: page,
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

    fetch(`${apiUrl}/nutrition/dishes/?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setDishes(data.results);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      })
      .catch(error => console.error('Error fetching dishes:', error));
  };

  useEffect(() => {
    fetch(`${apiUrl}/user/regularusers/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUsers(Array.isArray(data.results) ? data.results : []); // Asegura que users sea un array
        if (data.results.length > 0) {
          setSelectedUser(data.results[0]?.id?.toString() || '');
        }
      });
  }, [apiUrl]);

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleDishToggle = (dishId) => {
    const existingIndex = selectedDishes.findIndex(item => item.dishId === dishId);
    if (existingIndex >= 0) {
      setSelectedDishes(selectedDishes.filter((_, idx) => idx !== existingIndex));
    } else {
      const dish = dishes.find(dish => dish.id === dishId);
      if (dish) {
        setSelectedDishes([...selectedDishes, {
          dishId: dish.id,
          portion: 1,
          notes: '',
          name: dish.name
        }]);
      }
    }
  };

  const handleDishChange = (index, field, value) => {
    const updatedDishes = selectedDishes.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSelectedDishes(updatedDishes);
  };

  const handleRemoveDish = (index) => {
    setSelectedDishes(selectedDishes.filter((_, idx) => idx !== index));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const mealData = {
      name,
      user: selectedUser,
      dishes_data: selectedDishes.map(dish => ({ dish: dish.dishId, portion: dish.portion, notes: dish.notes }))
    };

    try {
      const response = await fetch(`${apiUrl}/nutrition/meals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
         },
        body: JSON.stringify(mealData),
      });
      if (response.ok) {
        const data = await response.json();
        setMealCreated(true);
        setCreatedMealId(data.id);
        setName('');
        setSelectedUser('');
        setSelectedDishes([]);
        toast.success('Comida creada exitosamente!');
      } else {
        console.error('Failed to create meal');
        toast.error('Error al crear la comida');
      }
    } catch (error) {
      console.error('Error creating meal:', error);
      toast.error('Error al crear la comida');
    }
  };

  const nutritionTotals = calculateNutritionTotals(selectedDishes, dishes);

  return (
    <div className="create-meal-container meal-container mt-5">
      <h2>Crear Comida</h2>
      <ToastContainer />
      {mealCreated ? (
        <div className="alert alert-success">
          <p>La Comida se ha creado correctamente. ID: {createdMealId}</p>
          <button onClick={() => setMealCreated(false)} className="btn btn-secondary ml-2">Crear otra Comida</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre de la Comida:</label>
            <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
  
          <div className="mb-3">
            <label htmlFor="userSelect" className="form-label">Usuario:</label>
            <select className="form-select" id="userSelect" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
  
          <h3>Filtros para Platos</h3>
          <div className="mb-3">
            <label htmlFor="filterName">Nombre del Plato:</label>
            <input
              type="text"
              className="form-control"
              id="filterName"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre"
              name="name"
            />
          </div>
  
          <button type="button" className="btn btn-info btn-lg mb-3" onClick={toggleAdvancedFilters}>
            {showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}
          </button>

          {showAdvancedFilters && (
            <div className="row">
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
            </div>
          )}
          <div className="row">
            <div className="col-md-6">
              <h3>Platos Disponibles</h3>
              {dishes.map((dish) => (
                <div key={dish.id} className="card mb-2">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <span>{dish.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleDishToggle(dish.id)}
                    >
                      {selectedDishes.some(item => item.dishId === dish.id) ? 'Quitar' : 'Añadir'}
                    </button>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="btn btn-secondary"
                >
                  Anterior
                </button>
                <span> Página {currentPage} de {totalPages} </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="btn btn-secondary"
                >
                  Siguiente
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <h3>Platos Seleccionados</h3>
              {selectedDishes.map((dish, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{dishes.find(d => d.id.toString() === dish.dishId)?.name || ''}</span>
                  <div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Porción"
                      value={dish.portion}
                      onChange={e => handleDishChange(index, 'portion', e.target.value)}
                      style={{ width: '100px' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Notas"
                      value={dish.notes}
                      onChange={e => handleDishChange(index, 'notes', e.target.value)}
                      style={{ width: '200px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveDish(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-success btn-lg">Crear Comida</button>
        </form>
      )}

      {/* Totales Nutricionales */}
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
              <li className="list-group-item">
                Grasas Saturadas: {nutritionTotals.saturated_fat.toFixed(2)}g
              </li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div className="col-md-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Libre de Gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                Libre de Lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</li>
              <li className="list-group-item">
                Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                Contiene Carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                Contiene Vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="col-md-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Contiene Pescado/Mariscos: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</li>
              <li className="list-group-item">
                Pasta o Arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}
              </li>
              <li className="list-group-item">
                Lácteos (Yogur, Queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}
              </li>
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

function calculateNutritionTotals(selectedDishes, dishes) {
  let totals = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    saturated_fat: 0,
    gluten_free: true,
    lactose_free: true,
    vegan: true,
    vegetarian: true,
    pescetarian: true,
    contains_meat: false,
    contains_vegetables: false,
    contains_fish_shellfish_canned_preserved: false,
    cereal: false,
    pasta_or_rice: false,
    dairy_yogurt_cheese: false,
    fruit: false,
    nuts: false,
    legume: false,
    sauce_or_condiment: false,
    deli_meat: false,
    bread_or_toast: false,
    egg: false,
    special_drink_or_supplement: false,
    tuber: false,
    other: false,
  };

  selectedDishes.forEach(({ dishId, portion }) => {
    const foundDish = dishes.find(dish => dish.id.toString() === dishId);
    if (foundDish && portion) {
      totals.calories += foundDish.calories * portion;
      totals.protein += foundDish.protein * portion;
      totals.carbohydrates += foundDish.carbohydrates * portion;
      totals.fat += foundDish.fat * portion;
      totals.sugar += foundDish.sugar * portion;
      totals.fiber += foundDish.fiber * portion;
      totals.saturated_fat += foundDish.saturated_fat * portion;
      totals.gluten_free = totals.gluten_free && foundDish.glutenFree;
      totals.lactose_free = totals.lactose_free && foundDish.lactoseFree;
      totals.vegan = totals.vegan && foundDish.vegan;
      totals.vegetarian = totals.vegetarian && foundDish.vegetarian;
      totals.pescetarian = totals.pescetarian && foundDish.pescetarian;
      totals.contains_meat = totals.contains_meat || foundDish.containsMeat;
      totals.contains_vegetables = totals.contains_vegetables || foundDish.containsVegetables;
      totals.contains_fish_shellfish_canned_preserved =
        totals.contains_fish_shellfish_canned_preserved ||
        foundDish.containsFishShellfishCannedPreserved;
      totals.cereal = totals.cereal || foundDish.cereal;
      totals.pasta_or_rice = totals.pasta_or_rice || foundDish.pastaOrRice;
      totals.dairy_yogurt_cheese = totals.dairy_yogurt_cheese || foundDish.dairyYogurtCheese;
      totals.fruit = totals.fruit || foundDish.fruit;
      totals.nuts = totals.nuts || foundDish.nuts;
      totals.legume = totals.legume || foundDish.legume;
      totals.sauce_or_condiment = totals.sauce_or_condiment || foundDish.sauceOrCondiment;
      totals.deli_meat = totals.deli_meat || foundDish.deliMeat;
      totals.bread_or_toast = totals.bread_or_toast || foundDish.breadOrToast;
      totals.egg = totals.egg || foundDish.egg;
      totals.special_drink_or_supplement =
        totals.special_drink_or_supplement || foundDish.specialDrinkOrSupplement;
      totals.tuber = totals.tuber || foundDish.tuber;
      totals.other = totals.other || foundDish.other;
    }
  });

  return totals;
}

export default CreateMeal;
