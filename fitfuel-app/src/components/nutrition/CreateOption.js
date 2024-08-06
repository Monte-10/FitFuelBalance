import React, { useState, useEffect } from 'react';
import './CreateOption.css';

function CreateOption() {
  const [name, setName] = useState('');
  const [weekOptions, setWeekOptions] = useState({
    week_option_one: [],
    week_option_two: [],
    week_option_three: [],
  });
  const [filter, setFilter] = useState({
    week_option_one: '',
    week_option_two: '',
    week_option_three: '',
  });
  const [currentPage, setCurrentPage] = useState({
    week_option_one: 1,
    week_option_two: 1,
    week_option_three: 1,
  });
  const [totalPages, setTotalPages] = useState({
    week_option_one: 0,
    week_option_two: 0,
    week_option_three: 0,
  });
  const [selectedWeekOptions, setSelectedWeekOptions] = useState({
    week_option_one: '',
    week_option_two: '',
    week_option_three: '',
  });
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const [itemsPerPage] = useState(6);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    Object.keys(weekOptions).forEach(weekOptionType => {
      fetchWeekOptions(weekOptionType, currentPage[weekOptionType], filter[weekOptionType]);
    });
  }, [currentPage, filter]);

  const fetchWeekOptions = (weekOptionType, page, filter) => {
    const queryParams = new URLSearchParams({
      page: page,
      page_size: itemsPerPage,
      name: filter,
    });

    fetch(`${apiUrl}/nutrition/weekoptions/?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setWeekOptions(prevWeekOptions => ({ ...prevWeekOptions, [weekOptionType]: data.results }));
        setTotalPages(prevTotalPages => ({
          ...prevTotalPages,
          [weekOptionType]: Math.ceil(data.count / itemsPerPage)
        }));
      })
      .catch(error => {
        console.error('Error fetching week options:', error);
        setError('Error al obtener las opciones semanales. Por favor, refresque la página.');
      });
  };

  const handleWeekOptionChange = (weekOptionType, value) => {
    setSelectedWeekOptions({ ...selectedWeekOptions, [weekOptionType]: value });
  };

  const handleFilterChange = (weekOptionType, e) => {
    setFilter({ ...filter, [weekOptionType]: e.target.value });
  };

  const handlePageChange = (weekOptionType, newPage) => {
    setCurrentPage(prevPage => ({ ...prevPage, [weekOptionType]: newPage }));
  };

  const handleDownloadPdf = async (optionId) => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/nutrition/options/${optionId}/pdf/`, {
      headers: {
        'Authorization': `Token ${authToken}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${name}_option.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      console.error('Error al descargar el PDF:', await response.text());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const optionData = {
      name,
      ...selectedWeekOptions,
    };

    console.log("Enviando datos de la opción", optionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/options/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(optionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Éxito:', data);
      setOptionCreated(true);

      handleDownloadPdf(data.id);
    } catch (error) {
      console.error('Error al crear la opción:', error);
      setError(`Error al crear la opción. Por favor, intente de nuevo. Error: ${error.toString()}`);
    }
  };

  return (
    <div className="create-option-container mt-4">
      <h2>Crear Opción</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="optionName" className="form-label">Nombre de la Opción:</label>
            <input
              type="text"
              className="form-control"
              id="optionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la opción"
            />
          </div>
          {['week_option_one', 'week_option_two', 'week_option_three'].map((weekOptionType, index) => (
            <div key={weekOptionType} className="mb-3">
              <label htmlFor={`${weekOptionType}Select`} className="form-label">Opción Semanal {index + 1}:</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder={`Buscar opción semanal ${index + 1}`}
                value={filter[weekOptionType]}
                onChange={(e) => handleFilterChange(weekOptionType, e)}
              />
              {weekOptions[weekOptionType].map((option) => (
                <div key={option.id} className="card mb-2 small-card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <span>{option.name}</span>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleWeekOptionChange(weekOptionType, option.id)}
                    >
                      {selectedWeekOptions[weekOptionType] === option.id ? 'Quitar' : 'Añadir'}
                    </button>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button
                  type="button"
                  disabled={currentPage[weekOptionType] === 1}
                  onClick={() => handlePageChange(weekOptionType, currentPage[weekOptionType] - 1)}
                  className="btn btn-secondary"
                >
                  Anterior
                </button>
                <span> Página {currentPage[weekOptionType]} de {totalPages[weekOptionType]} </span>
                <button
                  type="button"
                  disabled={currentPage[weekOptionType] >= totalPages[weekOptionType]}
                  onClick={() => handlePageChange(weekOptionType, currentPage[weekOptionType] + 1)}
                  className="btn btn-secondary"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Crear Opción</button>
        </form>
      ) : (
        <>
          <div className="alert alert-success" role="alert">
            ¡Opción creada exitosamente!
          </div>
        </>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </div>
  );
}

export default CreateOption;
