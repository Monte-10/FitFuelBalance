import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListFood.css';

function ListFood() {
    const [foods, setFoods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    const handleDeleteFood = (foodId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
            fetch(`${apiUrl}/nutrition/foods/${foodId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setFoods(foods.filter(food => food.id !== foodId));
                    // Refrescar los datos después de eliminar
                    fetchFoods(currentPage);
                } else {
                    console.error('Error al eliminar el alimento');
                }
            })
            .catch(error => console.error('Error al eliminar el alimento:', error));
        }
    };

    const fetchFoods = (page) => {
        fetch(`${apiUrl}/nutrition/foods/?page=${page}&page_size=${itemsPerPage}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setFoods(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        })
        .catch(error => console.error('Error fetching foods:', error));
    };

    useEffect(() => {
        fetchFoods(currentPage);
    }, [currentPage, apiUrl, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="container-listfood">
            <h1 className="mb-4">Lista de Alimentos</h1>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Calorías</th>
                            <th>Proteínas</th>
                            <th>Carbohidratos</th>
                            <th>Grasas</th>
                            <th>Azúcar</th>
                            <th>Fibra</th>
                            <th>Grasas Saturadas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(foods) && foods.length > 0 ? (
                            foods.map((food) => (
                                <tr key={food.id} onClick={() => navigate(`/nutrition/foods/${food.id}`)} style={{ cursor: 'pointer' }}>
                                    <td className="food-name">{food.name}</td>
                                    <td>{food.calories?.toFixed(2) || '0.00'}</td>
                                    <td>{food.protein?.toFixed(2) || '0.00'}</td>
                                    <td>{food.carbohydrates?.toFixed(2) || '0.00'}</td>
                                    <td>{food.fat?.toFixed(2) || '0.00'}</td>
                                    <td>{food.sugar?.toFixed(2) || '0.00'}</td>
                                    <td>{food.fiber?.toFixed(2) || '0.00'}</td>
                                    <td>{food.saturated_fat?.toFixed(2) || '0.00'}</td>
                                    <td className="actions-column">
                                        <div className="action-buttons">
                                            <Link to={`/nutrition/edit-food/${food.id}`} className="btn btn-primary btn-sm me-2" onClick={(e) => e.stopPropagation()}>
                                                ✏️
                                            </Link>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteFood(food.id); }} className="btn btn-danger btn-sm">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No se encontraron alimentos que coincidan con los filtros seleccionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-listfood">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="btn btn-secondary"
                >
                    Anterior
                </button>
                <span> Página {currentPage} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn btn-secondary"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListFood;
