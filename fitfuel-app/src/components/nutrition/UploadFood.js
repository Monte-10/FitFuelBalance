import React, { useState } from 'react';
import './UploadFood.css';

const UploadFood = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('csv_file', file);

      fetch(`${apiUrl}/nutrition/food_upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Unknown error occurred');
          });
        }
        return response.json();
      })
      .then(result => {
        alert(result.message || 'Foods imported successfully!');
      })
      .catch(error => {
        console.error('Error importing foods:', error);
        alert('Error importing foods: ' + error.message);
      });
    } else {
      alert('Please select a CSV file to upload.');
    }
  };

  return (
    <div className="upload-food-container mt-5">
      <h1 className="mb-4">Subir Alimentos por CSV</h1>
      <form onSubmit={handleFormSubmit} className="mb-3">
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            name="file"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Subir CSV</button>
      </form>
    </div>
  );
};

export default UploadFood;
