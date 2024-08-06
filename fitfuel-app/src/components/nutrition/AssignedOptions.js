import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Pagination, Table } from 'react-bootstrap';
import './AssignedOptions.css';

function AssignedOptions() {
    const [assignedOptions, setAssignedOptions] = useState([]);
    const [error, setError] = useState('');
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const optionsPerPage = 5;
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAssignedOptions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/nutrition/assigned-options/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    },
                });
                setAssignedOptions(response.data);
            } catch (error) {
                console.error('Error fetching assigned options:', error);
                setError('Failed to fetch assigned options. Please try again later.');
            }
        };

        fetchAssignedOptions();
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
            link.download = `assigned_option.pdf`;
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

    // Logic for displaying assigned options based on pagination
    const indexOfLastOption = currentPage * optionsPerPage;
    const indexOfFirstOption = indexOfLastOption - optionsPerPage;
    const currentOptions = assignedOptions.slice(indexOfFirstOption, indexOfLastOption);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="container-assigned mt-4">
            <h2 className="mb-4">Mis Opciones Asignadas</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {selectedPdfUrl ? (
                <div className="pdf-viewer">
                    <Button variant="secondary" onClick={handleClosePdf} className="btn-close-pdf">Cerrar PDF</Button>
                    <iframe src={selectedPdfUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
                </div>
            ) : (
                <>
                    {currentOptions.length > 0 ? (
                        <Table striped bordered hover className="assigned-options-table">
                            <thead>
                                <tr>
                                    <th>Nombre de la Opción</th>
                                    <th>Fecha de Asignación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOptions.map(option => (
                                    <tr key={option.id}>
                                        <td>{option.optionName}</td>
                                        <td>{new Date(option.start_date).toLocaleDateString()}</td>
                                        <td>
                                            {option.pdf_url && (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleDownloadPdf(`${apiUrl}${option.pdf_url}`)}
                                                        className="me-2"
                                                    >
                                                        Descargar PDF
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleViewPdf(option.pdf_url)}
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
                        <p>No tienes opciones asignadas actualmente.</p>
                    )}
                    <Pagination className="mt-3 justify-content-center">
                        {Array.from({ length: Math.ceil(assignedOptions.length / optionsPerPage) }, (_, index) => (
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

export default AssignedOptions;
