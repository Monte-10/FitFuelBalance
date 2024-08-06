import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditMeal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditMeal() {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [name, setName] = useState('');
    const [mealUpdated, setMealUpdated] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/meals/${mealId}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setSelectedUser(data.user);
                setSelectedDishes(data.dishes);
            })
            .catch(error => console.error('Error fetching meal details:', error));

        fetch(`${apiUrl}/nutrition/dishes/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => setDishes(data.results || []))
            .catch(error => console.error('Error fetching dishes:', error));

        fetch(`${apiUrl}/user/regularusers/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.results || []);
                if (data.results && data.results.length > 0 && !selectedUser) {
                    setSelectedUser(data.results[0].id.toString());
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [mealId, apiUrl, selectedUser]);

    const calculateNutritionTotals = () => {
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
            other: false
        };

        selectedDishes.forEach(({ dishId, portion }) => {
            const foundDish = Array.isArray(dishes) && dishes.find(dish => dish.id.toString() === dishId);
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
                totals.contains_fish_shellfish_canned_preserved = totals.contains_fish_shellfish_canned_preserved || foundDish.containsFishShellfishCannedPreserved;
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
                totals.special_drink_or_supplement = totals.special_drink_or_supplement || foundDish.specialDrinkOrSupplement;
                totals.tuber = totals.tuber || foundDish.tuber;
                totals.other = totals.other || foundDish.other;
            }
        });

        return totals;
    };

    const nutritionTotals = calculateNutritionTotals();

    const handleDishChange = (index, field, value) => {
        const updatedDishes = selectedDishes.map((dish, i) => {
            if (i === index) {
                return { ...dish, [field]: field === 'portion' ? parseFloat(value) : value };
            }
            return dish;
        });
        setSelectedDishes(updatedDishes);
    };

    const addDishField = () => {
        setSelectedDishes([...selectedDishes, { dishId: '', portion: '', notes: '' }]);
    };

    const removeDishField = (index) => {
        setSelectedDishes(selectedDishes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const mealData = {
            name,
            user: selectedUser,
            dishes_data: selectedDishes.map(dish => ({
                dish: dish.dishId,
                portion: dish.portion,
                notes: dish.notes
            })),
        };

        try {
            const response = await fetch(`${apiUrl}/nutrition/meals/${mealId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(mealData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Comida actualizada con éxito:', data);
            setMealUpdated(true);
            navigate(`/meal-details/${mealId}`); // Redirect to meal details page or another relevant page
        } catch (error) {
            console.error('Error al actualizar la comida:', error);
        }
    };

    return (
        <div className="container-editmeal mt-5">
            <ToastContainer />
            <h2 className="mb-4">Editar Comida</h2>
            {mealUpdated ? (
                <div className="alert alert-success">
                    <p>La Comida se ha actualizado correctamente.</p>
                    <button onClick={() => setMealUpdated(false)} className="btn btn-secondary mt-2">Editar otra Comida</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre de la Comida:</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="userSelect" className="form-label">Usuario:</label>
                        <select className="form-select" id="userSelect" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                            <option value="">Seleccione un usuario</option>
                            {Array.isArray(users) && users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    <h3>Platos</h3>
                    {selectedDishes.map((dish, index) => (
                        <div key={index} className="mb-3">
                            <div className="input-group">
                                <select className="form-select" value={dish.dishId} onChange={e => handleDishChange(index, 'dishId', e.target.value)} required>
                                    <option value="">Seleccione un Plato</option>
                                    {Array.isArray(dishes) && dishes.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <input type="number" className="form-control" placeholder="Porción" value={dish.portion} onChange={e => handleDishChange(index, 'portion', e.target.value)} />
                                <input type="text" className="form-control" placeholder="Notas (opcional)" value={dish.notes} onChange={e => handleDishChange(index, 'notes', e.target.value)} />
                                <button type="button" className="btn btn-danger" onClick={() => removeDishField(index)}>Eliminar</button>
                            </div>
                        </div>
                    ))}

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" className="btn btn-outline-secondary me-md-2" onClick={addDishField}>Añadir Plato</button>
                        <button type="submit" className="btn btn-primary">Actualizar Comida</button>
                    </div>
                </form>
            )}

            {/* Totales Nutricionales */}
            <div className="card mt-4">
                <div className="card-header">Totales Nutricionales</div>
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

export default EditMeal;
