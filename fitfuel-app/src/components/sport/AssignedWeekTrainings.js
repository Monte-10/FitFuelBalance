import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Pagination, Table } from 'react-bootstrap';
import './AssignedWeekTrainings.css';

function AssignedWeekTrainings() {
    const [assignedWeekTrainings, setAssignedWeekTrainings] = useState([]);
    const [error, setError] = useState('');
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const weekTrainingsPerPage = 5;
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAssignedWeekTrainings = async () => {
            try {
                const response = await axios.get(`${apiUrl}/sport/assigned-week-trainings/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    },
                });
                setAssignedWeekTrainings(response.data);
            } catch (error) {
                console.error('Error fetching assigned week trainings:', error);
                setError('Failed to fetch assigned week trainings. Please try again later.');
            }
        };

        fetchAssignedWeekTrainings();
    }, [apiUrl]);

    const handleDownloadPdf = async (pdfUrl) => {
        try {
            const response = await axios.get(pdfUrl, {
                responseType: 'blob' // Important to get the PDF as a blob
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `assigned_week_training.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Failed to download PDF. Please try again later.');
        }
    };

    const handleViewPdf = (pdfUrl) => {
        setSelectedPdfUrl(`${apiUrl}${pdfUrl}`);
    };

    const handleClosePdf = () => {
        setSelectedPdfUrl('');
    };

    // Logic for displaying assigned week trainings based on pagination
    const indexOfLastWeekTraining = currentPage * weekTrainingsPerPage;
    const indexOfFirstWeekTraining = indexOfLastWeekTraining - weekTrainingsPerPage;
    const currentWeekTrainings = assignedWeekTrainings.slice(indexOfFirstWeekTraining, indexOfLastWeekTraining);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="container-assigned mt-4">
            <h2 className="mb-4">Mis Entrenamientos Semanales Asignados</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {selectedPdfUrl ? (
                <div className="pdf-viewer">
                    <Button variant="secondary" onClick={handleClosePdf} className="btn-close-pdf">Cerrar PDF</Button>
                    <iframe src={selectedPdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
                </div>
            ) : (
                <>
                    {currentWeekTrainings.length > 0 ? (
                        <Table striped bordered hover className="assigned-week-trainings-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Entrenamiento</th>
                                    <th>Fecha de Asignación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentWeekTrainings.map(training => (
                                    <tr key={training.id}>
                                        <td>{training.week_training_name}</td>
                                        <td>{new Date(training.start_date).toLocaleDateString()}</td>
                                        <td>
                                            {training.pdf_url && (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleDownloadPdf(`${apiUrl}${training.pdf_url}`)}
                                                        className="me-2"
                                                    >
                                                        Descargar PDF
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleViewPdf(training.pdf_url)}
                                                    >
                                                        Ver PDF
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No tienes entrenamientos semanales asignados actualmente.</p>
                    )}
                    <Pagination className="mt-3 justify-content-center">
                        {Array.from({ length: Math.ceil(assignedWeekTrainings.length / weekTrainingsPerPage) }, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}
        </Container>
    );
}

export default AssignedWeekTrainings;
