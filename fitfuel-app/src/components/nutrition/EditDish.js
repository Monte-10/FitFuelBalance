import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditDish.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditDish() {
    const { dishId } = useParams();
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [nutritionTotals, setNutritionTotals] = useState({
        calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
        gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
        contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
        cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
        legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
        special_drink_or_supplement: false, tuber: false, other: false
    });
    const apiUrl = process.env.REACT_APP_API_URL;
    const [name, setName] = useState('');
    const [dishUpdated, setDishUpdated] = useState(false);

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/dishes/${dishId}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setSelectedIngredients(data.ingredients.map(ing => ({
                    ingredientId: ing.ingredient.id,
                    quantity: ing.quantity
                })));
            })
            .catch(error => console.error('Error fetching dish details:', error));

        fetch(`${apiUrl}/nutrition/ingredients/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => setIngredients(data.results || []))
            .catch(error => console.error('Error fetching ingredients:', error));

        fetch(`${apiUrl}/user/regularusers/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.results || []);
                if (data.results && data.results.length > 0) {
                    setSelectedUser(data.results[0].id.toString());
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [dishId, apiUrl]);

    useEffect(() => {
        const totals = selectedIngredients.reduce((acc, { ingredientId, quantity }) => {
            const ingredient = ingredients.find(ing => ing.id.toString() === ingredientId);
            if (ingredient) {
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

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = selectedIngredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [field]: field === 'quantity' ? parseFloat(value) : value };
            }
            return ingredient;
        });
        setSelectedIngredients(updatedIngredients);
    };

    const addIngredientField = () => {
        setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: 0 }]);
    };

    const removeIngredientField = (index) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleDuplicate = async (event) => {
        event.preventDefault();
        const dishData = {
            name,
            user: selectedUser,
            ingredients: selectedIngredients.filter(si => si.ingredientId && si.quantity).map(si => ({
                ingredient: si.ingredientId,
                quantity: parseFloat(si.quantity),
            })),
        };

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
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const newDish = await response.json();
            console.log('New dish created successfully:', newDish);
            navigate(`/dish-details/${newDish.id}`); // Redirect to the new dish details page
        } catch (error) {
            console.error('Error duplicating dish:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dishData = {
            name,
            user: selectedUser,
            ingredients: selectedIngredients.filter(si => si.ingredientId && si.quantity).map(si => ({
                ingredient: si.ingredientId,
                quantity: parseFloat(si.quantity),
            })),
        };

        try {
            const response = await fetch(`${apiUrl}/nutrition/dishes/${dishId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(dishData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const updatedData = await response.json();
            console.log('Dish updated successfully:', updatedData);
            setDishUpdated(true);
            navigate(`/dish-details/${dishId}`); // Redirect to dish details page or another relevant page
        } catch (error) {
            console.error('Error updating dish:', error);
        }
    };

    return (
        <div className="container-editdish mt-4">
            <h2 className="mb-4">Editar Plato</h2>
            {dishUpdated && <div className="alert alert-success">Plato actualizado con éxito!</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre del Plato:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="user" className="form-label">Usuario:</label>
                    <select
                        className="form-select"
                        id="user"
                        name="user"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar Usuario</option>
                        {Array.isArray(users) && users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="ingredient" className="form-label">Añadir Ingrediente:</label>
                    {selectedIngredients.map((ingredient, index) => (
                        <div key={index} className="input-group mb-3">
                            <select className="form-select" value={ingredient.ingredientId} onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)} required>
                                <option value="">Seleccionar Ingrediente</option>
                                {Array.isArray(ingredients) && ingredients.map((ing) => (
                                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                                ))}
                            </select>
                            <input type="number" className="form-control" placeholder="Cantidad" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                            <button type="button" className="btn btn-danger" onClick={() => removeIngredientField(index)}>Eliminar</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-info" onClick={addIngredientField}>Añadir Ingrediente</button>
                </div>

                <div className="card mt-4">
                    <div className="card-header">
                        Totales Nutricionales
                    </div>
                    <div className="row">
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

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary">Actualizar Plato</button>
                    <button type="button" className="btn btn-secondary ml-2" onClick={handleDuplicate}>Duplicar Plato</button>
                </div>
            </form>
        </div>
    );
}

export default EditDish;
