import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TrainerClientsList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const trainerId = localStorage.getItem('trainerId');
        if (!trainerId) {
            console.error('No trainer ID found');
            setError('No se encontró el ID del entrenador. Por favor, inicie sesión nuevamente.');
            setLoading(false);
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;

        fetch(`${apiUrl}/trainers/${trainerId}/clients/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la lista de clientes');
            }
            return response.json();
        })
        .then(data => {
            setClients(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Lista de Clientes</h2>
            {clients.length > 0 ? (
                <ul>
                    {clients.map(client => (
                        <li key={client.id}>
                            <Link to={`/client-details/${client.id}`}>{client.username}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay clientes asignados.</p>
            )}
        </div>
    );
}

export default TrainerClientsList;
