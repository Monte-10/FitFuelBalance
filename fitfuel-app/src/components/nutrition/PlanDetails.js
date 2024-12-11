import React, { useEffect, useState } from "react";
import { fetchPlanDetails } from "./PlanAPI";
import { useParams } from "react-router-dom";
import "./PlanDetails.css";

const PlanDetails = () => {
  const { id } = useParams();
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

  return (
    <div className="plan-details-container">
      {plan ? (
        <>
          <h2>Detalles del Plan: {plan.name}</h2>
          <p>
            <strong>Fechas:</strong> {plan.start_date} a {plan.end_date}
          </p>
          <p>
            <strong>Asignado a:</strong> {plan.user.username}
          </p>
          <h3>Comidas</h3>
          {Object.keys(plan.ingredients).map((day) => (
            <div key={day}>
              <h4>{day}</h4>
              <ul>
                {plan.ingredients[day].map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {ingredient.quantity}g
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <p>Cargando detalles del plan...</p>
      )}
    </div>
  );
};

export default PlanDetails;
