import React, { useState, useEffect } from 'react';
import './CreateWeekOption.css'; // Importa el archivo CSS

function CreateWeekOption() {
  const [name, setName] = useState('');
  const [selectedDayOptions, setSelectedDayOptions] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [dayOptions, setDayOptions] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [filter, setFilter] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [currentPage, setCurrentPage] = useState({
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1,
    sunday: 1,
  });
  const [totalPages, setTotalPages] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const [itemsPerPage] = useState(6);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    Object.keys(dayOptions).forEach(day => {
      fetchDayOptions(day, currentPage[day], filter[day]);
    });
  }, [currentPage, filter]);

  const fetchDayOptions = (day, page, filter) => {
    const queryParams = new URLSearchParams({
      page: page,
      page_size: itemsPerPage,
      name: filter,
    });

    fetch(`${apiUrl}/nutrition/dayoptions/?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setDayOptions(prevDayOptions => ({ ...prevDayOptions, [day]: data.results }));
        setTotalPages(prevTotalPages => ({
          ...prevTotalPages,
          [day]: Math.ceil(data.count / itemsPerPage)
        }));
      })
      .catch(error => {
        console.error('Error fetching day options:', error);
        setError('Error al obtener las opciones de día. Por favor, refresque la página.');
      });
  };

  const handleDayOptionChange = (day, value) => {
    setSelectedDayOptions({ ...selectedDayOptions, [day]: value });
  };

  const handleFilterChange = (day, e) => {
    setFilter({ ...filter, [day]: e.target.value });
  };

  const handlePageChange = (day, newPage) => {
    setCurrentPage(prevPage => ({ ...prevPage, [day]: newPage }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const weekOptionData = {
      name,
      ...Object.keys(selectedDayOptions).reduce((acc, day) => {
        acc[`${day}_option`] = selectedDayOptions[day];
        return acc;
      }, {}),
    };

    console.log("Enviando datos de la opción semanal", weekOptionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/weekoptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(weekOptionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Éxito:', data);
      setOptionCreated(true);
    } catch (error) {
      console.error('Error al crear la opción semanal:', error.message);
      setError('Error al crear la opción semanal. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="create-week-option-container mt-4">
      <h2>Crear Opción Semanal</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="weekOptionName" className="form-label">Nombre de la Opción Semanal:</label>
            <input
              type="text"
              className="form-control"
              id="weekOptionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la opción semanal"
            />
          </div>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <div key={day} className="mb-3">
              <label htmlFor={`${day}Option`} className="form-label">{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder={`Buscar opción de ${day}`}
                value={filter[day]}
                onChange={(e) => handleFilterChange(day, e)}
              />
              {dayOptions[day].map((option) => (
                <div key={option.id} className="card mb-2 small-card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <span>{option.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleDayOptionChange(day, option.id)}
                    >
                      {selectedDayOptions[day] === option.id ? 'Quitar' : 'Añadir'}
                    </button>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button
                  type="button"
                  disabled={currentPage[day] === 1}
                  onClick={() => handlePageChange(day, currentPage[day] - 1)}
                  className="btn btn-secondary"
                >
                  Anterior
                </button>
                <span> Página {currentPage[day]} de {totalPages[day]} </span>
                <button
                  type="button"
                  disabled={currentPage[day] >= totalPages[day]}
                  onClick={() => handlePageChange(day, currentPage[day] + 1)}
                  className="btn btn-secondary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Crear Opción Semanal</button>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </form>
      ) : (
        <div className="alert alert-success" role="alert">¡Opción semanal creada exitosamente!</div>
      )}
    </div>
  );
}

export default CreateWeekOption;
