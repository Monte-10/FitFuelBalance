import React, { useState, useEffect } from 'react';
import './AssignWeekTrainingToUser.css';

function AssignWeekTrainingToUser() {
    const [users, setUsers] = useState([]);
    const [weekTrainings, setWeekTrainings] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedWeekTraining, setSelectedWeekTraining] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [pdfDownloadUrl, setPdfDownloadUrl] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUsersAndWeekTrainings = async () => {
            try {
                const usersResponse = await fetch(`${apiUrl}/user/regularusers/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
                });
                const weekTrainingsResponse = await fetch(`${apiUrl}/sport/week_trainings/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
                });
                if (!usersResponse.ok || !weekTrainingsResponse.ok) throw new Error('Failed to fetch data');
                const usersData = await usersResponse.json();
                const weekTrainingsData = await weekTrainingsResponse.json();
                setUsers(usersData);
                setWeekTrainings(weekTrainingsData);
            } catch (error) {
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchUsersAndWeekTrainings();
    }, [apiUrl]);

    const handleDownloadPdf = async (assignedWeekTrainingId) => {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${apiUrl}/sport/week_training/${assignedWeekTrainingId}/pdf/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        });

        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            setPdfDownloadUrl(downloadUrl);
        } else {
            console.error('Error downloading PDF:', await response.text());
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/sport/assign_week_training/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    userId: selectedUser,
                    weekTrainingId: selectedWeekTraining,
                    startDate: selectedDate,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to assign week training: ${errorText}`);
            }

            const responseData = await response.json();
            setSuccess(true);
            setError('');

            const assignedWeekTrainingId = responseData.assignedWeekTrainingId;
            if (assignedWeekTrainingId) {
                handleDownloadPdf(assignedWeekTrainingId);
            } else {
                console.error('Assigned WeekTraining ID not found in response:', responseData);
                setError('Failed to get the assigned week training ID. PDF download is not available.');
            }

        } catch (error) {
            console.error('Error while assigning week training:', error);
            setError(`Failed to assign week training. Please try again. Error: ${error.toString()}`);
            setSuccess(false);
        }
    };

    return (
        <div className="container-assign-week mt-4">
            <h2 className="mb-4">Asignar Semana de Entrenamiento a Usuario</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && (
                <>
                    <div className="alert alert-success" role="alert">
                        ¡Semana de entrenamiento asignada exitosamente!
                        {pdfDownloadUrl && (
                            <a href={pdfDownloadUrl} download={`assigned_week_training.pdf`} className="btn btn-success">
                                Descargar PDF
                            </a>
                        )}
                    </div>
                </>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">Usuario:</label>
                    <select className="form-select" id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                        <option value="">Selecciona un usuario</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="weekTrainingSelect" className="form-label">Semana de Entrenamiento:</label>
                    <select className="form-select" id="weekTrainingSelect" value={selectedWeekTraining} onChange={(e) => setSelectedWeekTraining(e.target.value)} required>
                        <option value="">Selecciona una semana de entrenamiento</option>
                        {weekTrainings.map((weekTraining) => (
                            <option key={weekTraining.id} value={weekTraining.id}>{weekTraining.name}</option>
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
                <button type="submit" className="btn btn-success">Asignar Semana de Entrenamiento</button>
            </form>
        </div>
    );
}

export default AssignWeekTrainingToUser;
