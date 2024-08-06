import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './IngredientDetails.css'; // Asegúrate de tener un archivo CSS separado

function IngredientDetails() {
    const [ingredientDetails, setIngredientDetails] = useState(null);
    const { ingredientId } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => setIngredientDetails(data))
        .catch(error => console.error('Error fetching ingredient details:', error));
    }, [ingredientId, apiUrl]);

    if (!ingredientDetails) {
        return <div className="text-center">Cargando detalles del ingrediente...</div>;
    }

    return (
        <div className="container-ingredientd mt-5">
            <h1 className="mb-4">Detalles del Ingrediente</h1>
            <div className="card">
                {ingredientDetails.food_image && (
                    <img src={ingredientDetails.food_image} className="card-img-top" alt={ingredientDetails.name} />
                )}
                <div className="card-header">
                    {ingredientDetails.name}
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Calorías: {ingredientDetails.calories}</li>
                    <li className="list-group-item">Proteínas: {ingredientDetails.protein} g</li>
                    <li className="list-group-item">Carbohidratos: {ingredientDetails.carbohydrates} g</li>
                    <li className="list-group-item">Grasas: {ingredientDetails.fat} g</li>
                    <li className="list-group-item">Azúcar: {ingredientDetails.sugar} g</li>
                    <li className="list-group-item">Fibra: {ingredientDetails.fiber} g</li>
                    <li className="list-group-item">Grasas saturadas: {ingredientDetails.saturated_fat} g</li>
                    <li className="list-group-item">Libre de gluten: {ingredientDetails.gluten_free ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Libre de lactosa: {ingredientDetails.lactose_free ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Vegano: {ingredientDetails.vegan ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Vegetariano: {ingredientDetails.vegetarian ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pescetariano: {ingredientDetails.pescetarian ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene carne: {ingredientDetails.contains_meat ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene vegetales: {ingredientDetails.contains_vegetables ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene pescado/mariscos/enlatados/preservados: {ingredientDetails.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Cereal: {ingredientDetails.cereal ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pasta o arroz: {ingredientDetails.pasta_or_rice ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Lácteos (yogur, queso): {ingredientDetails.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Fruta: {ingredientDetails.fruit ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Frutos secos: {ingredientDetails.nuts ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Legumbre: {ingredientDetails.legume ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Salsa o condimento: {ingredientDetails.sauce_or_condiment ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Embutido: {ingredientDetails.deli_meat ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pan o tostada: {ingredientDetails.bread_or_toast ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Huevo: {ingredientDetails.egg ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Bebida especial o suplemento: {ingredientDetails.special_drink_or_supplement ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Tubérculo: {ingredientDetails.tuber ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Otro: {ingredientDetails.other ? 'Sí' : 'No'}</li>
                </ul>
            </div>
        </div>
    );
}

export default IngredientDetails;
