import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const IngredientModal = ({ show, onClose, onIngredientSelect }) => {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (show) {
      fetch(`${apiUrl}/nutrition/ingredients/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      })
        .then((res) => res.json())
        .then((data) => setIngredients(data.results));
    }
  }, [show, apiUrl]);

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectIngredient = (ingredient) => {
    onIngredientSelect(ingredient);
    onClose();  // Cerrar el modal después de seleccionar
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Ingrediente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar ingrediente por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="list-group">
          {filteredIngredients.map((ingredient) => (
            <li key={ingredient.id} className="list-group-item">
              {ingredient.name}
              <Button
                variant="primary"
                className="float-right"
                onClick={() => handleSelectIngredient(ingredient)}
              >
                Seleccionar
              </Button>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IngredientModal;
