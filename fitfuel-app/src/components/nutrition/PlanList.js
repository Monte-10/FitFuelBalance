import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PlanList() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/nutrition/plans/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener planes");
        }
        const data = await response.json();
        // data.results contiene el array real
        setPlans(data.results || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // (Opcional) Función para eliminar
  const handleDelete = async (planId) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este plan?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/nutrition/plans/${planId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar plan");
      }
      // Si se elimina con éxito, filtra el plan de la lista
      setPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId));
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("No se pudo eliminar el plan.");
    }
  };

  if (plans.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Lista de Planes</h2>
        <p>No hay planes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Planes</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Rango de Fechas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.name}</td>
              <td>
                {plan.start_date} / {plan.end_date}
              </td>
              <td>
                {/* Botón para ver detalles (PlanDetails) */}
                <button
                  className="btn btn-primary btn-sm mr-2"
                  onClick={() => navigate(`/nutrition/plans/${plan.id}`)}
                >
                  Ver Detalle
                </button>

                {/* Botón para editar => /nutrition/plans/:id/edit */}
                <button
                  className="btn btn-warning btn-sm mr-2"
                  onClick={() => navigate(`/nutrition/plans/${plan.id}/edit`)}
                >
                  Editar
                </button>

                {/* Botón para eliminar */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(plan.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanList;
