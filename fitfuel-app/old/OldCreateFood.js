import React, { useState } from 'react';

function CreateFood() {
    const initialState = {
        name: '',
        unit_weight: 0,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        sugar: 0,
        fiber: 0,
        fat: 0,
        saturated_fat: 0,
        gluten_free: false,
        lactose_free: false,
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
        other: false,
    };

    const [foodData, setFoodData] = useState(initialState);
    const [creationSuccess, setCreationSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFoodData({ ...foodData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        console.log('Submitting food data:', foodData);

        fetch('${apiUrl}/nutrition/foods/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Food created successfully:', data);
            setCreationSuccess(true);
            // Aquí podrías redirigir o limpiar el formulario
            setFoodData(initialState);
        })
        .catch((error) => {
            console.error('Error creating food:', error);
            setError(error.message);
        });
    };

    if (creationSuccess) {
        return (
            <div>
                <p>La Comida se ha creado correctamente.</p>
                <a href="/nutrition/foods">Volver a lista de Comidas</a><br />
                <button onClick={() => setCreationSuccess(false)}>Crear una nueva</button>
            </div>
        );
    }

    return (
        <div>
            {error && <p>Error creando Comida: {error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={foodData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Unit Weight:
                    <input
                        type="number"
                        name="unit_weight"
                        value={foodData.unit_weight}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Calories:
                    <input
                        type="number"
                        name="calories"
                        value={foodData.calories}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Protein:
                    <input
                        type="number"
                        name="protein"
                        value={foodData.protein}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Carbohydrates:
                    <input
                        type="number"
                        name="carbohydrates"
                        value={foodData.carbohydrates}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Sugar:
                    <input
                        type="number"
                        name="sugar"
                        value={foodData.sugar}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Fiber:
                    <input
                        type="number"
                        name="fiber"
                        value={foodData.fiber}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Fat:
                    <input
                        type="number"
                        name="fat"
                        value={foodData.fat}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Saturated Fat:
                    <input
                        type="number"
                        name="saturated_fat"
                        value={foodData.saturated_fat}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Gluten Free:
                    <input
                        type="checkbox"
                        name="gluten_free"
                        checked={foodData.gluten_free}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Lactose Free:
                    <input
                        type="checkbox"
                        name="lactose_free"
                        checked={foodData.lactose_free}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Vegan:
                    <input
                        type="checkbox"
                        name="vegan"
                        checked={foodData.vegan}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Vegetarian:
                    <input
                        type="checkbox"
                        name="vegetarian"
                        checked={foodData.vegetarian}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pescetarian:
                    <input
                        type="checkbox"
                        name="pescetarian"
                        checked={foodData.pescetarian}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Contains Meat:
                    <input
                        type="checkbox"
                        name="contains_meat"
                        checked={foodData.contains_meat}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Contains Vegetables:
                    <input
                        type="checkbox"
                        name="contains_vegetables"
                        checked={foodData.contains_vegetables}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Contains Fish/Shellfish/Canned/Preserved:
                    <input
                        type="checkbox"
                        name="contains_fish_shellfish_canned_preserved"
                        checked={foodData.contains_fish_shellfish_canned_preserved}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Cereal:
                    <input
                        type="checkbox"
                        name="cereal"
                        checked={foodData.cereal}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pasta or Rice:
                    <input
                        type="checkbox"
                        name="pasta_or_rice"
                        checked={foodData.pasta_or_rice}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Dairy/Yogurt/Cheese:
                    <input
                        type="checkbox"
                        name="dairy_yogurt_cheese"
                        checked={foodData.dairy_yogurt_cheese}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Fruit:
                    <input
                        type="checkbox"
                        name="fruit"
                        checked={foodData.fruit}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Nuts:
                    <input
                        type="checkbox"
                        name="nuts"
                        checked={foodData.nuts}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Legume:
                    <input
                        type="checkbox"
                        name="legume"
                        checked={foodData.legume}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Sauce or Condiment:
                    <input
                        type="checkbox"
                        name="sauce_or_condiment"
                        checked={foodData.sauce_or_condiment}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Deli Meat:
                    <input
                        type="checkbox"
                        name="deli_meat"
                        checked={foodData.deli_meat}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bread or Toast:
                    <input
                        type="checkbox"
                        name="bread_or_toast"
                        checked={foodData.bread_or_toast}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Egg:
                    <input
                        type="checkbox"
                        name="egg"
                        checked={foodData.egg}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Special Drink or Supplement:
                    <input
                        type="checkbox"
                        name="special_drink_or_supplement"
                        checked={foodData.special_drink_or_supplement}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Tuber:
                    <input
                        type="checkbox"
                        name="tuber"
                        checked={foodData.tuber}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Other:
                    <input
                        type="checkbox"
                        name="other"
                        checked={foodData.other}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Create Food</button>
            </form>
        </div>
    );
}

export default CreateFood;
