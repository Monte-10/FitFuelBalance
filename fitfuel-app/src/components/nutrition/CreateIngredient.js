import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateIngredient.css';

function CreateIngredient() {
  const [foods, setFoods] = useState([]); // Lista completa de alimentos
  const [filteredFoods, setFilteredFoods] = useState([]); // Alimentos filtrados
  const [selectedFood, setSelectedFood] = useState(null); // Alimento seleccionado
  const [quantity, setQuantity] = useState(0); // Cantidad del ingrediente
  const [name, setName] = useState(''); // Nombre del ingrediente
  const [nutritionalInfo, setNutritionalInfo] = useState({}); // Información nutricional
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // Estado para mostrar/ocultar filtros avanzados
  const [filters, setFilters] = useState({ // Estado de los filtros
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
  const [itemsPerPage] = useState(6); // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const apiUrl = process.env.REACT_APP_API_URL; // URL de la API

  // Obtener todos los alimentos filtrados
  const fetchFoods = useCallback(() => {
    fetch(`${apiUrl}/nutrition/foods/?page_size=1000`, { // Obtener todos los alimentos
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setFoods(data.results); // Guardar todos los alimentos
      })
      .catch(error => console.error('Error fetching foods:', error));
  }, [apiUrl]);

  useEffect(() => {
    fetchFoods(); // Llamar a fetchFoods cuando se monta el componente
  }, [fetchFoods]);

  // Aplicar los filtros
  useEffect(() => {
    const applyFilters = () => {
      const filtered = foods.filter(food => {
        return (
          (!filters.name || food.name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (!filters.minCalories || food.calories >= parseFloat(filters.minCalories)) &&
          (!filters.maxCalories || food.calories <= parseFloat(filters.maxCalories)) &&
          (!filters.minProtein || food.protein >= parseFloat(filters.minProtein)) &&
          (!filters.maxProtein || food.protein <= parseFloat(filters.maxProtein)) &&
          (!filters.minCarbohydrates || food.carbohydrates >= parseFloat(filters.minCarbohydrates)) &&
          (!filters.maxCarbohydrates || food.carbohydrates <= parseFloat(filters.maxCarbohydrates)) &&
          (!filters.minFat || food.fat >= parseFloat(filters.minFat)) &&
          (!filters.maxFat || food.fat <= parseFloat(filters.maxFat)) &&
          (!filters.minSugar || food.sugar >= parseFloat(filters.minSugar)) &&
          (!filters.maxSugar || food.sugar <= parseFloat(filters.maxSugar)) &&
          (!filters.minFiber || food.fiber >= parseFloat(filters.minFiber)) &&
          (!filters.maxFiber || food.fiber <= parseFloat(filters.maxFiber)) &&
          (!filters.minSaturatedFat || food.saturated_fat >= parseFloat(filters.minSaturatedFat)) &&
          (!filters.maxSaturatedFat || food.saturated_fat <= parseFloat(filters.maxSaturatedFat))
        );
      });

      setFilteredFoods(filtered); // Guardar los alimentos filtrados
      setCurrentPage(1); // Reiniciar a la primera página
    };

    applyFilters();
  }, [foods, filters]); // Ejecutar el filtrado cuando cambian los alimentos o los filtros

  // Alimentos paginados
  const currentFoods = filteredFoods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Cambiar página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredFoods.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Manejador de cambios en los filtros
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Alternar la visibilidad de los filtros avanzados
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Resetear los filtros
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

  // Seleccionar un alimento
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

  // Manejar el cambio de cantidad
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  // Calcular los valores nutricionales según la cantidad
  const calculateNutritionalValues = (value, quantity) => {
    if (!value || !quantity) return 0;
    return (value * quantity) / 100;
  };

  // Manejar el envío del formulario para crear el ingrediente
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
            {currentFoods.map(food => (
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

          {/* Paginación justo debajo de los alimentos */}
          <div className="pagination-create-ingredient mt-3">
            <button
              type="button" // Este botón ya no dispara el submit del formulario
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn btn-secondary"
            >
              Anterior
            </button>
            <span> Página {currentPage} de {Math.ceil(filteredFoods.length / itemsPerPage)} </span>
            <button
              type="button" // Este botón ya no dispara el submit del formulario
              disabled={currentPage >= Math.ceil(filteredFoods.length / itemsPerPage)}
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn btn-secondary"
            >
              Siguiente
            </button>
          </div>

          <label htmlFor="quantity" className="form-label mt-3">Cantidad (g)</label>
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
