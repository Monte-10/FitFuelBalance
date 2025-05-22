import React, { useEffect, useState } from "react";
import { fetchPlanDetails } from "./PlanAPI";
import { useParams, useNavigate } from "react-router-dom";
import "./PlanDetails.css";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const loadPlanDetails = async () => {
      try {
        const data = await fetchPlanDetails(id);
        setPlan(data);
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };
    loadPlanDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/nutrition/plans/${id}/edit`, { state: { selectedUser: plan.user } });
  };

  return (
    <div className="plan-details-container">
      {plan ? (
        <>
          <h2>Detalles del Plan: {plan.name}</h2>
          <p>
            <strong>Fechas:</strong> {plan.start_date} a {plan.end_date}
          </p>
          <p>
            <strong>Asignado a:</strong> {plan.user?.username}
          </p>

          {/* Render de las comidas */}
          <h3>Comidas</h3>
          {/* plan.custom_meals es un array, cada item = un "customMeal" */}
          {plan.custom_meals?.length ? (
            plan.custom_meals.map((meal) => (
              <div key={meal.id} style={{ marginBottom: '1rem' }}>
                <h4>{meal.day} - {meal.meal_type}</h4>
                {/* meal.ingredients = array de { ingredient, quantity, unit_based } */}
                <ul>
                  {meal.ingredients.map((ing, index) => (
                    <li key={index}>
                      {/* No tenemos "name" a menos que anidemos IngredientSerializer 
                          en el back. Por ahora solo ID. */}
                      Ingredient #{ing.ingredient} - {ing.quantity}g
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No hay comidas registradas.</p>
          )}

          <button className="btn btn-primary mt-3" onClick={handleEdit}>
            Editar Plan
          </button>
        </>
      ) : (
        <p>Cargando detalles del plan...</p>
      )}
    </div>
  );
};

export default PlanDetails;
