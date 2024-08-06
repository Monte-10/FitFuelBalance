import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateIngredient.css';

function CreateIngredient() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [nutritionalInfo, setNutritionalInfo] = useState({});
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
    maxSaturatedFat: ''
  });
  const [itemsPerPage] = useState(6); // Cambiado a 6 para más platos por página
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFoods(currentPage, filters);
  }, [currentPage, filters]);

  const fetchFoods = (page, filters) => {
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
      saturated_fat__lte: filters.maxSaturatedFat
    });

    fetch(`${apiUrl}/nutrition/foods/?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setFoods(data.results);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      })
      .catch(error => console.error('Error fetching foods:', error));
  };

  useEffect(() => {
    const updatedFoods = foods.filter(food => {
      return Object.entries(filters).every(([key, filter]) => {
        if (!filter || filter === '') return true;
        const value = parseFloat(filter);
        switch (key) {
          case 'name':
            return food.name.toLowerCase().includes(filter.toLowerCase());
          case 'minCalories':
            return food.calories >= value;
          case 'maxCalories':
            return food.calories <= value;
          case 'minProtein':
            return food.protein >= value;
          case 'maxProtein':
            return food.protein <= value;
          case 'minCarbohydrates':
            return food.carbohydrates >= value;
          case 'maxCarbohydrates':
            return food.carbohydrates <= value;
          case 'minFat':
            return food.fat >= value;
          case 'maxFat':
            return food.fat <= value;
          case 'minSugar':
            return food.sugar >= value;
          case 'maxSugar':
            return food.sugar <= value;
          case 'minFiber':
            return food.fiber >= value;
          case 'maxFiber':
            return food.fiber <= value;
          case 'minSaturatedFat':
            return food.saturated_fat >= value;
          case 'maxSaturatedFat':
            return food.saturated_fat <= value;
          default:
            return true;
        }
      });
    });
    setFilteredFoods(updatedFoods);
  }, [foods, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const resetFilters = () => {
    setFilters({
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
      maxSaturatedFat: ''
    });
    setShowAdvancedFilters(false);
  };

  const handleSelectChange = (foodId) => {
    if (selectedFood && selectedFood.id === foodId) {
      setSelectedFood(null);
      setNutritionalInfo({});
    } else {
      const selectedFoodItem = foods.find(food => food.id === foodId);
      setSelectedFood(selectedFoodItem);
      setNutritionalInfo(selectedFoodItem ? selectedFoodItem : {});
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const calculateNutritionalValues = (value, quantity) => {
    if (!value || !quantity) return 0;
    return (value * quantity) / 100;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ingredientData = {
      name: name,
      food: selectedFood ? selectedFood.id : null,
      quantity: quantity
    };

    fetch(`${apiUrl}/nutrition/ingredients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(ingredientData)
    })
      .then(response => response.json())
      .then(data => {
        toast.success('Ingrediente creado exitosamente!');
        setName('');
        setSelectedFood(null);
        setQuantity(0);
      })
      .catch(error => {
        console.error('Error creando el ingrediente:', error);
        toast.error('Error creando el ingrediente');
      });
  };

  return (
    <div className="create-ingredient-container mt-4">
      <h2>Crear Ingrediente</h2>
      <form onSubmit={handleSubmit}>
        <h3>Filtros para Ingredientes</h3>
        <div className="row">
          <div className="mb-3">
            <label htmlFor="filterName" className="form-label">Nombre del Alimento</label>
            <input 
              type="text" 
              className="form-control" 
              id="filterName" 
              value={filters.name} 
              onChange={e => handleFilterChange('name', e.target.value)} 
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
                    className="form-control"
                    id="filterMinCalories"
                    value={filters.minCalories}
                    onChange={e => handleFilterChange('minCalories', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxCalories" className="form-label">Máximo de Calorías</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxCalories"
                    value={filters.maxCalories}
                    onChange={e => handleFilterChange('maxCalories', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinProtein" className="form-label">Mínimo de Proteínas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinProtein"
                    value={filters.minProtein}
                    onChange={e => handleFilterChange('minProtein', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxProtein" className="form-label">Máximo de Proteínas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxProtein"
                    value={filters.maxProtein}
                    onChange={e => handleFilterChange('maxProtein', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="filterMinCarbohydrates" className="form-label">Mínimo de Carbohidratos</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinCarbohydrates"
                    value={filters.minCarbohydrates}
                    onChange={e => handleFilterChange('minCarbohydrates', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxCarbohydrates" className="form-label">Máximo de Carbohidratos</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxCarbohydrates"
                    value={filters.maxCarbohydrates}
                    onChange={e => handleFilterChange('maxCarbohydrates', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinFat" className="form-label">Mínimo de Grasas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinFat"
                    value={filters.minFat}
                    onChange={e => handleFilterChange('minFat', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxFat" className="form-label">Máximo de Grasas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxFat"
                    value={filters.maxFat}
                    onChange={e => handleFilterChange('maxFat', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="filterMinSugar" className="form-label">Mínimo de Azúcares</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinSugar"
                    value={filters.minSugar}
                    onChange={e => handleFilterChange('minSugar', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxSugar" className="form-label">Máximo de Azúcares</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxSugar"
                    value={filters.maxSugar}
                    onChange={e => handleFilterChange('maxSugar', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinFiber" className="form-label">Mínimo de Fibra</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinFiber"
                    value={filters.minFiber}
                    onChange={e => handleFilterChange('minFiber', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxFiber" className="form-label">Máximo de Fibra</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxFiber"
                    value={filters.maxFiber}
                    onChange={e => handleFilterChange('maxFiber', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button type="button" className="btn btn-secondary" onClick={resetFilters}>Limpiar Filtros</button>

        <hr />
        <h3>Crear Ingrediente</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            value={name} 
            onChange={e => setName(e.target.value)}
          />

          <label className="form-label">Alimento</label>
          <div className="row">
            {filteredFoods.map(food => (
              <div key={food.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{food.name}</h5>
                    <button 
                      type="button" 
                      className={`btn ${selectedFood && selectedFood.id === food.id ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleSelectChange(food.id)}
                    >
                      {selectedFood && selectedFood.id === food.id ? 'Quitar' : 'Seleccionar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <label htmlFor="quantity" className="form-label">Cantidad (g)</label>
          <input 
            type="number" 
            className="form-control" 
            id="quantity" 
            value={quantity} 
            onChange={handleQuantityChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear Ingrediente</button>

        <div className="card mt-4">
          <h3>Información Nutricional</h3>
          <div className="row">
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Calorías: {calculateNutritionalValues(nutritionalInfo.calories, quantity)} kcal</li>
                <li className="list-group-item">Proteínas: {calculateNutritionalValues(nutritionalInfo.protein, quantity)} g</li>
                <li className="list-group-item">Carbohidratos: {calculateNutritionalValues(nutritionalInfo.carbohydrates, quantity)} g</li>
                <li className="list-group-item">Grasas: {calculateNutritionalValues(nutritionalInfo.fat, quantity)} g</li>
                <li className="list-group-item">Azúcares: {calculateNutritionalValues(nutritionalInfo.sugar, quantity)} g</li>
                <li className="list-group-item">Fibra: {calculateNutritionalValues(nutritionalInfo.fiber, quantity)} g</li>
                <li className="list-group-item">Grasas Saturadas: {calculateNutritionalValues(nutritionalInfo.saturated_fat, quantity)} g</li>
                <li className="list-group-item">Sin Gluten: {nutritionalInfo.gluten_free ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Sin Lactosa: {nutritionalInfo.lactose_free ? 'Sí' : 'No'}</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Vegano: {nutritionalInfo.vegan ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Vegetariano: {nutritionalInfo.vegetarian ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Pescetariano: {nutritionalInfo.pescetarian ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contiene Carne: {nutritionalInfo.contains_meat ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contiene Verduras: {nutritionalInfo.contains_vegetables ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contiene Pescado/Mariscos/Enlatado: {nutritionalInfo.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Cereal: {nutritionalInfo.cereal ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Pasta o Arroz: {nutritionalInfo.pasta_or_rice ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Lácteos/Yogur/Queso: {nutritionalInfo.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Fruta: {nutritionalInfo.fruit ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Nueces: {nutritionalInfo.nuts ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Legumbres: {nutritionalInfo.legume ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Salsa o Condimento: {nutritionalInfo.sauce_or_condiment ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Embutido: {nutritionalInfo.deli_meat ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Pan o Tostada: {nutritionalInfo.bread_or_toast ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Huevo: {nutritionalInfo.egg ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Bebida Especial o Suplemento: {nutritionalInfo.special_drink_or_supplement ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Tubérculo: {nutritionalInfo.tuber ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Otro: {nutritionalInfo.other ? 'Sí' : 'No'}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateIngredient;
