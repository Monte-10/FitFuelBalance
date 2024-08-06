import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListDish.css';

function ListDish() {
    const [dishes, setDishes] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
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

    const fetchDishes = (page, filters) => {
        const queryParams = new URLSearchParams({
            page: page + 1,
            page_size: itemsPerPage,
            ...filters
        });

        fetch(`${apiUrl}/nutrition/dishes/?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setDishes(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        })
        .catch(error => console.error('Error fetching dishes:', error));
    };

    useEffect(() => {
        fetchDishes(currentPage, filters);
    }, [currentPage, filters]);

    const handleDeleteDish = (dishId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            fetch(`${apiUrl}/nutrition/dishes/${dishId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    fetchDishes(currentPage, filters);
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

    const currentDishes = dishes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="container-listdish">
            <h1 className="mb-4">Lista de Platos</h1>
            <div className="row mb-4 row-listdish">
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
                <div className="row mb-4 row-listdish">
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

            <table className="table-listdish table-striped">
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
                    {dishes.map(dish => (
                        <tr key={dish.id} onClick={() => navigate(`/nutrition/dishes/${dish.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{dish.name}</td>
                            <td>{(dish.calories || 0).toFixed(2)}</td>
                            <td>{(dish.protein || 0).toFixed(2)}</td>
                            <td>{(dish.carbohydrates || 0).toFixed(2)}</td>
                            <td>{(dish.fat || 0).toFixed(2)}</td>
                            <td>{(dish.sugar || 0).toFixed(2)}</td>
                            <td>{(dish.fiber || 0).toFixed(2)}</td>
                            <td>{(dish.saturatedFat || 0).toFixed(2)}</td>
                            <td>
                                <Link to={`/nutrition/edit-dish/${dish.id}`} className="btn-listdish btn-primary-listdish me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                            </td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish.id); }} className="btn-listdish btn-danger-listdish">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {dishes.length === 0 && (
                <div className="alert-listdish alert-info-listdish" role="alert">
                    No se encontraron platos que coincidan con los filtros seleccionados.
                </div>
            )}

            <div className="pagination-listdish">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn-listdish btn-secondary-listdish"
                >
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn-listdish btn-secondary-listdish"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListDish;
