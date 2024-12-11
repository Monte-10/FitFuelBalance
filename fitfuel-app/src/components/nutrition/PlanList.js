import React, { useEffect, useState } from "react";
import { fetchPlans } from "./PlanAPI";
import { useNavigate } from "react-router-dom";
import "./PlanList.css";

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    loadPlans();
  }, []);

  return (
    <div className="plan-list-container">
      <h2>Planes Disponibles</h2>
      {plans.length > 0 ? (
        <ul className="plan-list">
          {plans.map((plan) => (
            <li key={plan.id} onClick={() => navigate(`/nutrition/plans/${plan.id}`)}>
              <strong>{plan.name}</strong> - {plan.start_date} a {plan.end_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay planes disponibles.</p>
      )}
    </div>
  );
};

export default PlanList;
