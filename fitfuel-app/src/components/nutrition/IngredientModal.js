import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
// Elimino cualquier import de iconos

const IngredientModal = ({ show, onClose, onIngredientSelect, ingredients = [], searchValue = '', onSearch, page = 1, totalPages = 1, totalCount = 0, onPageChange, pageSize = 10, onPageSizeChange }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const bottomRef = useRef(null);

  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e);
  };

  const handleSelectIngredient = (ingredient) => {
    onIngredientSelect(ingredient);
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    onClose && onClose(); // Por si acaso, aunque el modal padre lo gestiona
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
      <ul className="list-group" style={{ marginBottom: 0 }}>
        {ingredients.map((ingredient, idx) => {
          console.log('ingredient', ingredient);
          let name = ingredient.name;
          if (typeof name !== 'string') {
            name = '[ERROR: nombre no es string]';
          }
          return (
            <li
              key={ingredient.id || idx}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ padding: '6px 10px', fontSize: 15, background: '#23272b', color: '#fff', border: '1px solid #333', borderRadius: 6, marginBottom: 4 }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <Button
                variant="outline-success"
                size="sm"
                style={{ fontSize: 18, padding: '2px 7px', borderRadius: 16, minWidth: 0, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8, boxShadow: 'none' }}
                onClick={() => handleSelectIngredient(ingredient)}
                title="Seleccionar"
              >
                {'+'}
              </Button>
            </li>
          );
        })}
        </ul>
      <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" style={{ minWidth: 80 }} onClick={() => onPageChange(page - 1)} disabled={page === 1}>Anterior</Button>
          <span style={{ margin: '0 8px', fontSize: 14 }}>Página {page} de {totalPages} <span style={{ color: '#888', fontSize: 13 }}>(Total: {totalCount})</span></span>
          <Button variant="secondary" size="sm" style={{ minWidth: 80 }} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Siguiente</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label className="me-2" style={{ fontSize: 14 }}>Mostrar:</label>
          <select value={pageSize} onChange={onPageSizeChange} className="form-select" style={{ width: 70, fontSize: 14, padding: '2px 6px' }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div ref={bottomRef} style={{ marginTop: 16, textAlign: 'right' }}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default IngredientModal;
