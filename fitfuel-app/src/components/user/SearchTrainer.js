import React, { useState } from 'react';
import './SearchTrainer.css'; // Importar el archivo de estilos

const SearchTrainer = ({ onSearch }) => {
    const [specialty, setSpecialty] = useState('');
    const [trainerType, setTrainerType] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(specialty, trainerType);
    };

    return (
        <div className="container-search-trainer mt-4">
            <h2 className="title-search-trainer">Buscar Entrenador</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Especialidad:</label>
                    <select className="form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="weight_loss">Pérdida de peso</option>
                        <option value="muscle_gain">Ganancia muscular</option>
                        <option value="strength">Fuerza</option>
                        <option value="endurance">Resistencia</option>
                        <option value="flexibility">Flexibilidad</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Entrenador:</label>
                    <select className="form-select" value={trainerType} onChange={(e) => setTrainerType(e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="trainer">Entrenador</option>
                        <option value="nutritionist">Nutricionista</option>
                        <option value="both">Ambos</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
        </div>
    );
};

export default SearchTrainer;
