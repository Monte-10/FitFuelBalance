import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListMeal.css';

function ListMeal() {
    const [meals, setMeals] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Ajusta este número según sea necesario
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
        glutenFree: false,
        lactoseFree: false,
        vegan: false,
        vegetarian: false,
        pescetarian: false,
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
        other: false
    });

    const navigate = useNavigate();

    const fetchMeals = async (page = 0) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/nutrition/meals/?page=${page + 1}&page_size=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            });
            const data = await response.json();
            setMeals(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        } catch (error) {
            console.error('Error fetching meals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals(currentPage);
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        const applyFilters = () => {
            fetchMeals(0); // Reset to first page when filters change
        };

        applyFilters();
    }, [filters]);

    const handleDeleteMeal = (mealId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            fetch(`${apiUrl}/nutrition/meals/${mealId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    fetchMeals(currentPage); // Refetch meals after deletion
                } else {
                    console.error('Error al eliminar la comida');
                }
            })
            .catch(error => console.error('Error al eliminar la comida:', error));
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            maxSaturatedFat: '',
            glutenFree: false,
            lactoseFree: false,
            vegan: false,
            vegetarian: false,
            pescetarian: false,
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
            other: false
        });
    };

    return (
        <div className="container-listmeal">
            <h1 className="mb-4">Lista de Comidas</h1>
            <div className="row mb-4 row-listmeal">
                <div className="col-md-3 mb-3">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Filtrar por nombre..."
                        value={filters.name}
                        onChange={(e) => handleFilterChange({ target: { name: 'name', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <button className="btn btn-info w-100" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                        {showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}
                    </button>
                </div>
                <div className="col-md-3 mb-3">
                    <button className="btn btn-secondary w-100" onClick={resetFilters}>Limpiar Filtros</button>
                </div>
            </div>

            {showAdvancedFilters && (
                <div className="row mb-4 row-listmeal">
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Calorías mínimas"
                            value={filters.minCalories}
                            onChange={(e) => handleFilterChange({ target: { name: 'minCalories', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Calorías máximas"
                            value={filters.maxCalories}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxCalories', value: e.target.value } })}
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Proteínas mínimas"
                            value={filters.minProtein}
                            onChange={(e) => handleFilterChange({ target: { name: 'minProtein', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Proteínas máximas"
                            value={filters.maxProtein}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxProtein', value: e.target.value } })}
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Carbohidratos mínimos"
                            value={filters.minCarbohydrates}
                            onChange={(e) => handleFilterChange({ target: { name: 'minCarbohydrates', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Carbohidratos máximos"
                            value={filters.maxCarbohydrates}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxCarbohydrates', value: e.target.value } })}
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Grasas mínimas"
                            value={filters.minFat}
                            onChange={(e) => handleFilterChange({ target: { name: 'minFat', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Grasas máximas"
                            value={filters.maxFat}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxFat', value: e.target.value } })}
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Azúcar mínimo"
                            value={filters.minSugar}
                            onChange={(e) => handleFilterChange({ target: { name: 'minSugar', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Azúcar máximo"
                            value={filters.maxSugar}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxSugar', value: e.target.value } })}
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Fibra mínima"
                            value={filters.minFiber}
                            onChange={(e) => handleFilterChange({ target: { name: 'minFiber', value: e.target.value } })}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Fibra máxima"
                            value={filters.maxFiber}
                            onChange={(e) => handleFilterChange({ target: { name: 'maxFiber', value: e.target.value } })}
                        />
                    </div>
                </div>
            )}

            <table className="table-listmeal table-striped">
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
                    {meals.map(meal => (
                        <tr key={meal.id} onClick={() => navigate(`/nutrition/meals/${meal.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{meal.name}</td>
                            <td>{(meal.calories || 0).toFixed(2)}</td>
                            <td>{(meal.protein || 0).toFixed(2)}</td>
                            <td>{(meal.carbohydrates || 0).toFixed(2)}</td>
                            <td>{(meal.fat || 0).toFixed(2)}</td>
                            <td>{(meal.sugar || 0).toFixed(2)}</td>
                            <td>{(meal.fiber || 0).toFixed(2)}</td>
                            <td>{(meal.saturated_fat || 0).toFixed(2)}</td>
                            <td>
                                <Link to={`/nutrition/edit-meal/${meal.id}`} className="btn-listmeal btn-primary-listmeal me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                            </td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteMeal(meal.id); }} className="btn-listmeal btn-danger-listmeal">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <div>Loading...</div>}
            {!loading && meals.length === 0 && (
                <div className="alert-listmeal alert-info-listmeal" role="alert">
                    No se encontraron comidas que coincidan con los filtros seleccionados.
                </div>
            )}

            <div className="pagination-listmeal">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn-listmeal btn-secondary-listmeal"
                >
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn-listmeal btn-secondary-listmeal"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListMeal;
