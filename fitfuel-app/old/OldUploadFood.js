import React, { useState } from 'react';

const UploadFood = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('csv_file', file);

      fetch('${apiUrl}/nutrition/food_upload/', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        console.log('Response:', response);
        console.log('Body:', response.body);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        console.log('Success:', result);
        alert('Foods imported successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error importing foods: ' + error.message);
      });
    } else {
      alert('Please select a CSV file to upload.');
    }
  };

  return (
    <div>
      <h1>Upload Food Data</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit">Upload CSV</button>
      </form>
    </div>
  );
};

export default UploadFood;
