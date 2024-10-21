import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListIngredient.css';

function ListIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [itemsPerPage] = useState(10); // Cantidad por página
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    // Función para eliminar un ingrediente
    const handleDeleteIngredient = (ingredientId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
            fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setIngredients(ingredients.filter(ingredient => ingredient.id !== ingredientId));
                    // Refrescar los datos después de eliminar
                    fetchIngredients(currentPage);
                } else {
                    console.error('Error al eliminar el ingrediente');
                }
            })
            .catch(error => console.error('Error al eliminar el ingrediente:', error));
        }
    };

    // Función para obtener los ingredientes con paginación
    const fetchIngredients = (page) => {
        fetch(`${apiUrl}/nutrition/ingredients/?page=${page}&page_size=${itemsPerPage}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setIngredients(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage)); // Calcular total de páginas
        })
        .catch(error => console.error('Error fetching ingredients:', error));
    };

    useEffect(() => {
        fetchIngredients(currentPage); // Obtener los ingredientes de la página actual
    }, [currentPage, apiUrl, itemsPerPage]);

    // Función para cambiar de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage); // Cambiar a la nueva página
        }
    };

    return (
        <div className="container-listingredient">
            <h1 className="mb-4">Lista de Ingredientes</h1>

            {/* Tabla de ingredientes */}
            <table className="table-listingredient table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Calorías</th>
                        <th>Proteínas</th>
                        <th>Carbohidratos</th>
                        <th>Grasas</th>
                        <th>Azúcares</th>
                        <th>Fibra</th>
                        <th>Grasas Saturadas</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ingredients) && ingredients.length > 0 ? (
                        ingredients.map((ingredient) => (
                            <tr key={ingredient.id} onClick={() => navigate(`/nutrition/ingredients/${ingredient.id}`)} style={{ cursor: 'pointer' }}>
                                <td>{ingredient.name}</td>
                                <td>{ingredient.calories ? ingredient.calories.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.protein ? ingredient.protein.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.carbohydrates ? ingredient.carbohydrates.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.fat ? ingredient.fat.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.sugar ? ingredient.sugar.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.fiber ? ingredient.fiber.toFixed(2) : 'N/A'}</td>
                                <td>{ingredient.saturated_fat ? ingredient.saturated_fat.toFixed(2) : 'N/A'}</td>
                                <td>
                                    <Link to={`/nutrition/edit-ingredient/${ingredient.id}`} className="btn btn-primary-listingredient me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                                </td>
                                <td>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteIngredient(ingredient.id); }} className="btn btn-danger-listingredient">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">No se encontraron ingredientes que coincidan con los filtros seleccionados.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="pagination-listingredient">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="btn btn-secondary-listingredient"
                >
                    Anterior
                </button>
                <span> Página {currentPage} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn btn-secondary-listingredient"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListIngredients;
