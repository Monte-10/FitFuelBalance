import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditIngredient.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditIngredient() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6); // Mostrar más alimentos por página
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ name: '' });
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Cargar la información existente del ingrediente
    const fetchIngredient = async () => {
      try {
        const response = await fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        if (!response.ok) throw new Error('Error al cargar los detalles del ingrediente.');
        const data = await response.json();
        setIngredient(data);
      } catch (error) {
        console.error('Error fetching ingredient details:', error);
        setError('Error cargando los detalles del ingrediente.');
      }
    };
    fetchIngredient();
  }, [ingredientId, apiUrl]);

  useEffect(() => {
    // Cargar lista de alimentos para el selector con paginación y filtros
    const fetchFoods = async (page) => {
      try {
        const queryParams = new URLSearchParams({
          page: page + 1,
          page_size: itemsPerPage,
          name: filters.name,
        });
        const response = await fetch(`${apiUrl}/nutrition/foods/?${queryParams.toString()}`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        });
        if (!response.ok) throw new Error('Error al cargar la lista de alimentos.');
        const data = await response.json();
        setFoods(data.results);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (error) {
        console.error('Error fetching foods:', error);
        setFoods([]);
      }
    };
    fetchFoods(currentPage);
  }, [apiUrl, currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngredient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(ingredient)
      });
      if (!response.ok) throw new Error('Error al actualizar el ingrediente.');
      navigate(`/nutrition/ingredients/`);  // Redirigir a la lista de ingredientes o detalles
    } catch (error) {
      console.error('Error updating ingredient:', error);
      setError('Error al actualizar el ingrediente.');
    }
  };

  const handleDuplicate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/nutrition/ingredients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: ingredient.name,
          food: ingredient.food,
          quantity: ingredient.quantity
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      const newIngredient = await response.json();
      navigate(`/nutrition/ingredients/${newIngredient.id}`); // Navegar al nuevo ingrediente creado
    } catch (error) {
      console.error('Error duplicando el ingrediente:', error);
      setError(`Error al duplicar el ingrediente: ${error.message}`);
    }
  };

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  if (error) return <div>Error: {error}</div>;
  if (!ingredient) return <div>Cargando...</div>;

  return (
    <div className="container-editingredient mt-5">
      <h2 className="mb-4">Editar Ingrediente</h2>
      <ToastContainer />
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={ingredient.name || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="food" className="form-label">Alimento</label>
          <select
            className="form-select"
            id="food"
            name="food"
            value={ingredient.food || ''}
            onChange={handleChange}
          >
            <option value="">Selecciona un alimento</option>
            {foods.map((food) => (
              <option key={food.id} value={food.id}>{food.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Cantidad (g)</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={ingredient.quantity || 0}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Ingrediente</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleDuplicate}>Duplicar Ingrediente</button>
      </form>
      <div className="ingredient-list mt-4">
        <h3>Buscar Alimentos</h3>
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={filters.name}
              onChange={handleFilterChange}
              name="name"
            />
          </div>
        </div>
        <div className="row">
          {foods.map((food) => (
            <div key={food.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  {food.food_image && (
                    <img
                      src={food.food_image}
                      className="card-img-top"
                      alt={food.name}
                      style={{ maxWidth: '100px', marginBottom: '10px' }}
                    />
                  )}
                  <h5 className="card-title">{food.name}</h5>
                  <button
                    type="button"
                    className={ingredient.food === food.id ? "btn btn-danger" : "btn btn-primary"}
                    onClick={() => handleChange({ target: { name: 'food', value: food.id } })}
                  >
                    {ingredient.food === food.id ? "Seleccionado" : "Seleccionar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="btn btn-secondary"
          >
            Anterior
          </button>
          <span> Página {currentPage + 1} de {totalPages} </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="btn btn-secondary"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditIngredient;
