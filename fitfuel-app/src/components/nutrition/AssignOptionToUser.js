import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AssignOptionToUser.css';

function AssignOptionToUser() {
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsersAndOptions = async () => {
      try {
        const usersResponse = await fetch(`${apiUrl}/user/regularusers/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const optionsResponse = await fetch(`${apiUrl}/nutrition/options/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });

        if (!usersResponse.ok || !optionsResponse.ok) throw new Error('Error al obtener los datos');
        
        const usersData = await usersResponse.json();
        const optionsData = await optionsResponse.json();

        // Utiliza los arrays dentro de la propiedad `results`
        setUsers(usersData.results);
        setOptions(optionsData.results);
      } catch (error) {
        setError('Error al obtener los datos. Por favor, intente nuevamente más tarde.');
      }
    };

    fetchUsersAndOptions();
  }, [apiUrl]);

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
      setPdfDownloadUrl(downloadUrl);
      toast.success('PDF listo para descargar');
    } else {
      const errorText = await response.text();
      toast.error(`Error al descargar el PDF: ${errorText}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    toast.info('Asignando opción, por favor espere...');

    try {
      const response = await fetch(`${apiUrl}/nutrition/assignOption/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          userId: selectedUser,
          optionId: selectedOption,
          startDate: selectedDate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al asignar la opción: ${errorText}`);
      }

      const responseData = await response.json();
      setLoading(false);
      setSuccess(true);
      toast.success('Opción asignada exitosamente!');

      const optionId = responseData.optionId;
      if (optionId) {
        handleDownloadPdf(optionId);
      } else {
        toast.error('No se encontró el ID de la opción. No se puede descargar el PDF.');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error al asignar la opción. Por favor, intente nuevamente.');
      toast.error(`Error al asignar la opción. Por favor, intente nuevamente. Error: ${error.toString()}`);
    }
  };

  return (
    <div className="assign-option-container mt-4">
      <h2>Asignar Opción al Usuario</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userSelect" className="form-label">Usuario:</label>
          <select className="form-select" id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">Seleccionar Usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="optionSelect" className="form-label">Opción:</label>
          <select className="form-select" id="optionSelect" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required>
            <option value="">Seleccionar Opción</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Fecha de Inicio:</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Asignando...
            </>
          ) : 'Asignar Opción'}
        </button>
      </form>
      {pdfDownloadUrl && (
        <div className="mt-3">
          <a href={pdfDownloadUrl} download={`assigned_option.pdf`} className="btn btn-success">
            Descargar PDF
          </a>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default AssignOptionToUser;
