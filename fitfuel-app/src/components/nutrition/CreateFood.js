import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateFood.css'; // Asegúrate de importar el CSS aquí

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
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'file') {
            setImage(e.target.files[0]);
        } else {
            setFoodData({
                ...foodData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        const formData = new FormData();
        Object.keys(foodData).forEach(key => formData.append(key, foodData[key]));
        if (image) {
            formData.append('image', image);
        }

        console.log('Submitting food data with image:', formData);

        fetch(`${apiUrl}/nutrition/foods/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Food created successfully:', data);
            toast.success('El alimento se ha creado correctamente');
            setFoodData(initialState);
            setImage(null);
        })
        .catch((error) => {
            console.error('Error creating food:', error);
            setError(error.message);
            toast.error('Error al crear el alimento');
        });
    };

    return (
        <div className="container mt-5 create-food-container">
            <h2>Crear Alimento</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label-createfood create-food-form-label">Nombre:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={foodData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="unit_weight" className="form-label-createfood create-food-form-label">Peso por Unidad:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="unit_weight"
                                name="unit_weight"
                                value={foodData.unit_weight}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="calories" className="form-label-createfood create-food-form-label">Calorías:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="calories"
                                name="calories"
                                value={foodData.calories}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="protein" className="form-label-createfood create-food-form-label">Proteína:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="protein"
                                name="protein"
                                value={foodData.protein}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="carbohydrates" className="form-label-createfood create-food-form-label">Carbohidratos:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="carbohydrates"
                                name="carbohydrates"
                                value={foodData.carbohydrates}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sugar" className="form-label-createfood create-food-form-label">Azúcar:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="sugar"
                                name="sugar"
                                value={foodData.sugar}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fiber" className="form-label-createfood create-food-form-label">Fibra:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="fiber"
                                name="fiber"
                                value={foodData.fiber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fat" className="form-label-createfood create-food-form-label">Grasa:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="fat"
                                name="fat"
                                value={foodData.fat}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="saturated_fat" className="form-label-createfood create-food-form-label">Grasa Saturada:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="saturated_fat"
                                name="saturated_fat"
                                value={foodData.saturated_fat}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="gluten_free"
                                name="gluten_free"
                                checked={foodData.gluten_free}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="gluten_free">Sin Gluten</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="lactose_free"
                                name="lactose_free"
                                checked={foodData.lactose_free}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="lactose_free">Sin Lactosa</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="vegan"
                                name="vegan"
                                checked={foodData.vegan}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="vegan">Vegano</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="vegetarian"
                                name="vegetarian"
                                checked={foodData.vegetarian}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="vegetarian">Vegetariano</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="pescetarian"
                                name="pescetarian"
                                checked={foodData.pescetarian}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="pescetarian">Pescetariano</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="contains_meat"
                                name="contains_meat"
                                checked={foodData.contains_meat}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="contains_meat">Contiene Carne</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="contains_vegetables"
                                name="contains_vegetables"
                                checked={foodData.contains_vegetables}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="contains_vegetables">Contiene Vegetales</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="contains_fish_shellfish_canned_preserved"
                                name="contains_fish_shellfish_canned_preserved"
                                checked={foodData.contains_fish_shellfish_canned_preserved}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="contains_fish_shellfish_canned_preserved">Contiene Pescado/Mariscos/Enlatados/Preservados</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="cereal"
                                name="cereal"
                                checked={foodData.cereal}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="cereal">Cereal</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="pasta_or_rice"
                                name="pasta_or_rice"
                                checked={foodData.pasta_or_rice}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="pasta_or_rice">Pasta o Arroz</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="dairy_yogurt_cheese"
                                name="dairy_yogurt_cheese"
                                checked={foodData.dairy_yogurt_cheese}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="dairy_yogurt_cheese">Lácteos/Yogur/Queso</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="fruit"
                                name="fruit"
                                checked={foodData.fruit}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="fruit">Fruta</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="nuts"
                                name="nuts"
                                checked={foodData.nuts}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="nuts">Nueces</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="legume"
                                name="legume"
                                checked={foodData.legume}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="legume">Legumbres</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="sauce_or_condiment"
                                name="sauce_or_condiment"
                                checked={foodData.sauce_or_condiment}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="sauce_or_condiment">Salsa o Condimento</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="deli_meat"
                                name="deli_meat"
                                checked={foodData.deli_meat}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="deli_meat">Carne Procesada</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="bread_or_toast"
                                name="bread_or_toast"
                                checked={foodData.bread_or_toast}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="bread_or_toast">Pan o Tostada</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="egg"
                                name="egg"
                                checked={foodData.egg}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="egg">Huevo</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="special_drink_or_supplement"
                                name="special_drink_or_supplement"
                                checked={foodData.special_drink_or_supplement}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="special_drink_or_supplement">Bebida Especial o Suplemento</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="tuber"
                                name="tuber"
                                checked={foodData.tuber}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="tuber">Tubérculo</label>
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="other"
                                name="other"
                                checked={foodData.other}
                                onChange={handleChange}
                            />
                            <label className="form-check-label create-food-form-check-label" htmlFor="other">Otro</label>
                        </div>

                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label-createfood create-food-form-label">Imagen:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <button type="submit" className="btn btn-primary mt-3">Crear Alimento</button>
            </form>

            <ToastContainer />
        </div>
    );
}

export default CreateFood;
