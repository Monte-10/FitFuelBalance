import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';
import './WeeklyTrainings.css';

function WeeklyTrainings() {
  const [weeklyTrainings, setWeeklyTrainings] = useState([]);
  const [error, setError] = useState('');
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchWeeklyTrainings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sport/week_trainings/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          },
        });
        setWeeklyTrainings(response.data);
      } catch (error) {
        console.error('Error fetching weekly trainings:', error);
        setError('Failed to fetch weekly trainings. Please try again later.');
      }
    };

    fetchWeeklyTrainings();
  }, [apiUrl]);

  const handleDownloadPdf = async (weekId) => {
    try {
      const response = await axios.get(`${apiUrl}/sport/week_training/${weekId}/pdf/`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Week_Training_${weekId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download PDF. Please try again later.');
    }
  };

  return (
    <Container className="mt-4 container-weekly-trainings">
      <h2>Mis Entrenamientos Semanales</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {weeklyTrainings.length > 0 ? (
        weeklyTrainings.map(week => (
          <Card key={week.id} className="mb-3">
            <Card.Body>
              <Card.Title>{`Semana del ${new Date(week.start_date).toLocaleDateString()}`}</Card.Title>
              <Button variant="success" onClick={() => handleDownloadPdf(week.id)}>Descargar PDF</Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No tienes entrenamientos semanales asignados actualmente.</p>
      )}
      {selectedPdfUrl && (
        <div className="pdf-viewer">
          <iframe src={selectedPdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
        </div>
      )}
    </Container>
  );
}

export default WeeklyTrainings;
