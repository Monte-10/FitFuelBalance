import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FoodDetails.css'; // Asegúrate de tener un archivo CSS separado

function FoodDetails() {
    const [foodDetails, setFoodDetails] = useState(null);
    const { foodId } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/foods/${foodId}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => setFoodDetails(data))
        .catch(error => console.error('Error fetching food details:', error));
    }, [foodId, apiUrl]);

    if (!foodDetails) {
        return <div className="text-center">Cargando detalles del alimento...</div>;
    }

    return (
        <div className="container-foodd mt-5">
            <h1 className="mb-4">Detalles del Alimento</h1>
            <div className="card">
                {foodDetails.image && (
                    <img src={foodDetails.image} className="card-img-top" alt={foodDetails.name} />
                )}
                <div className="card-header">
                    {foodDetails.name}
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Calorías: {foodDetails.calories}</li>
                    <li className="list-group-item">Proteínas: {foodDetails.protein} g</li>
                    <li className="list-group-item">Carbohidratos: {foodDetails.carbohydrates} g</li>
                    <li className="list-group-item">Grasas: {foodDetails.fat} g</li>
                    <li className="list-group-item">Azúcar: {foodDetails.sugar} g</li>
                    <li className="list-group-item">Fibra: {foodDetails.fiber} g</li>
                    <li className="list-group-item">Grasas saturadas: {foodDetails.saturated_fat} g</li>
                    <li className="list-group-item">Libre de gluten: {foodDetails.gluten_free ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Libre de lactosa: {foodDetails.lactose_free ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Vegano: {foodDetails.vegan ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Vegetariano: {foodDetails.vegetarian ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pescetariano: {foodDetails.pescetarian ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene carne: {foodDetails.contains_meat ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene vegetales: {foodDetails.contains_vegetables ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Contiene pescado/mariscos/enlatados/preservados: {foodDetails.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Cereal: {foodDetails.cereal ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pasta o arroz: {foodDetails.pasta_or_rice ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Lácteos (yogur, queso): {foodDetails.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Fruta: {foodDetails.fruit ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Frutos secos: {foodDetails.nuts ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Legumbre: {foodDetails.legume ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Salsa o condimento: {foodDetails.sauce_or_condiment ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Embutido: {foodDetails.deli_meat ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Pan o tostada: {foodDetails.bread_or_toast ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Huevo: {foodDetails.egg ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Bebida especial o suplemento: {foodDetails.special_drink_or_supplement ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Tubérculo: {foodDetails.tuber ? 'Sí' : 'No'}</li>
                    <li className="list-group-item">Otro: {foodDetails.other ? 'Sí' : 'No'}</li>
                </ul>
            </div>
        </div>
    );
}

export default FoodDetails;
