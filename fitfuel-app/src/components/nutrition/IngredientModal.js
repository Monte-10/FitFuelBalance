import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const IngredientModal = ({ show, onClose, onIngredientSelect, ingredients = [], searchValue = '', onSearch, page = 1, totalPages = 1, totalCount = 0, onPageChange, pageSize = 10, onPageSizeChange }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);

  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e);
  };

  const handleSelectIngredient = (ingredient) => {
    onIngredientSelect(ingredient);
    onClose();  // Cerrar el modal después de seleccionar
  };

  return (
    <div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar ingrediente por nombre"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul className="list-group">
        {ingredients.map((ingredient) => (
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
      <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div>
          <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Anterior</Button>
          <span style={{ margin: '0 12px' }}>Página {page} de {totalPages} (Total: {totalCount})</span>
          <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Siguiente</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className="me-2">Mostrar:</label>
          <select value={pageSize} onChange={onPageSizeChange} className="form-select" style={{ width: 70 }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default IngredientModal;
