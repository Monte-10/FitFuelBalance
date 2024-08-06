import React, { useState, useEffect } from 'react';
import './CreateWeekTraining.css';

function CreateWeekTraining() {
    const [trainings, setTrainings] = useState([]);
    const [weekTraining, setWeekTraining] = useState({
        name: '',
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    });
    const [error, setError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const trainingsResponse = await fetch(`${apiUrl}/sport/trainings/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
                });
                if (!trainingsResponse.ok) throw new Error('Failed to fetch data');
                const trainingsData = await trainingsResponse.json();
                setTrainings(trainingsData);
            } catch (error) {
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchTrainings();
    }, [apiUrl]);

    const handleChange = (day, trainingId) => {
        setWeekTraining(prevState => ({
            ...prevState,
            [day]: [...prevState[day], trainingId]
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedWeekTraining = {
            ...weekTraining,
            monday: weekTraining.monday.map(id => parseInt(id)),
            tuesday: weekTraining.tuesday.map(id => parseInt(id)),
            wednesday: weekTraining.wednesday.map(id => parseInt(id)),
            thursday: weekTraining.thursday.map(id => parseInt(id)),
            friday: weekTraining.friday.map(id => parseInt(id)),
            saturday: weekTraining.saturday.map(id => parseInt(id)),
            sunday: weekTraining.sunday.map(id => parseInt(id)),
        };

        try {
            const response = await fetch(`${apiUrl}/sport/week_trainings/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(formattedWeekTraining),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create week training: ${errorText}`);
            }

            alert('Week training created successfully!');
        } catch (error) {
            console.error('Error while creating week training:', error);
            setError(`Failed to create week training. Please try again. Error: ${error.toString()}`);
        }
    };

    return (
        <div className="container-create-week-training mt-4">
            <h2>Crear Semana de Entrenamiento</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="weekTrainingName" className="form-label">Nombre de la Semana de Entrenamiento:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="weekTrainingName"
                        value={weekTraining.name}
                        onChange={(e) => setWeekTraining({ ...weekTraining, name: e.target.value })}
                        required
                    />
                </div>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <div className="mb-3" key={day}>
                        <label className="form-label">{day.charAt(0).toUpperCase() + day.slice(1)} Entrenamientos:</label>
                        <select className="form-select" multiple onChange={(e) => handleChange(day, e.target.value)}>
                            {trainings.map(training => (
                                <option key={training.id} value={training.id}>{training.name}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="submit" className="btn btn-success">Crear Semana de Entrenamiento</button>
            </form>
        </div>
    );
}

export default CreateWeekTraining;
