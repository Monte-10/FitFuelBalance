// src/components/nutrition/PlanAPI.js
const API_URL = process.env.REACT_APP_API_URL;

export async function fetchPlans() {
  const response = await fetch(`${API_URL}/nutrition/plans/`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('authToken')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener planes');
  }
  return response.json();
}

export async function fetchPlanDetails(planId) {
  const response = await fetch(`${API_URL}/nutrition/plans/${planId}/`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('authToken')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener detalles del plan');
  }
  return response.json();
}

export async function deletePlan(planId) {
  const response = await fetch(`${API_URL}/nutrition/plans/${planId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('authToken')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el plan');
  }
  return true;
}
