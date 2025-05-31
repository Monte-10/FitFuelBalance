import React, { useEffect, useState } from "react";
import { fetchPlanDetails } from "./PlanAPI";
import { useParams, useNavigate } from "react-router-dom";
import "./PlanDetails.css";

const API_URL = process.env.REACT_APP_API_URL;

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [ingredientsDict, setIngredientsDict] = useState({});

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

  useEffect(() => {
    // Traer todos los ingredientes y armar un diccionario {id: nombre}
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${API_URL}/nutrition/ingredients/?page_size=1000`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        const dict = {};
        (data.results || []).forEach(ing => {
          dict[ing.id] = ing.name;
        });
        setIngredientsDict(dict);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
    fetchIngredients();
  }, []);

  const handleEdit = () => {
    navigate(`/nutrition/plans/${id}/edit`, { state: { selectedUser: plan.user } });
  };

  return (
    <>
      <div className="plan-details-background" />
      <div className="plan-details-overlay" />
    <div className="plan-details-container">
      {plan ? (
        <>
            <h2 className="plan-details-title">Detalles del Plan: {plan.name}</h2>
            <p className="plan-details-info">
            <strong>Fechas:</strong> {plan.start_date} a {plan.end_date}
          </p>
            <p className="plan-details-info">
            <strong>Asignado a:</strong> {plan.user?.username}
          </p>

            <h3 className="plan-details-section-title">Comidas</h3>
          {plan.custom_meals?.length ? (
            plan.custom_meals.map((meal) => (
                <div key={meal.id} className="plan-details-meal-card enhanced-meal-card">
                  <div className="meal-header">
                    <span className="meal-day">{meal.day}</span>
                    <span className="meal-type">{meal.meal_type}</span>
                  </div>
                  <ul className="meal-ingredients-list">
                  {meal.ingredients.map((ing, index) => (
                      <li key={index} className="meal-ingredient-item">
                        <span className="ingredient-dot" />
                        <span className="ingredient-name">{ingredientsDict[ing.ingredient] || `Ingrediente #${ing.ingredient}`}</span>
                        <span className="ingredient-qty">{ing.quantity}g</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
              <p className="plan-details-info">No hay comidas registradas.</p>
          )}

            <button className="plan-details-edit-btn" onClick={handleEdit}>
            Editar Plan
          </button>
        </>
      ) : (
          <p className="plan-details-info">Cargando detalles del plan...</p>
      )}
    </div>
    </>
  );
};

export default PlanDetails;
