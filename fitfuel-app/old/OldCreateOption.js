import React, { useState, useEffect } from 'react';

function CreateOption() {
  const [name, setName] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);
  const [selectedWeekOptions, setSelectedWeekOptions] = useState({
    week_option_one: '',
    week_option_two: '',
    week_option_three: ''
  });
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('${apiUrl}/nutrition/weekoptions/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setWeekOptions(data))
    .catch(error => {
      console.error('Error fetching week options:', error);
      setError('Failed to fetch week options. Please refresh the page.');
    });
  }, []);

  const handleWeekOptionChange = (weekOptionType, value) => {
    setSelectedWeekOptions({ ...selectedWeekOptions, [weekOptionType]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const optionData = {
      name,
      ...selectedWeekOptions
    };

    console.log("Sending option data", optionData);

    fetch('${apiUrl}/nutrition/options/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(optionData),
    })
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setOptionCreated(true);
    })
    .catch((error) => {
      console.error('Error creating option:', error);
      setError(`Failed to create option. Please try again. Error: ${error.toString()}`);
    });
  };

  return (
    <div>
      {!optionCreated ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Option Name"
            />
            {['week_option_one', 'week_option_two', 'week_option_three'].map((weekOptionType, index) => (
              <div key={index}>
                <select value={selectedWeekOptions[weekOptionType]} onChange={(e) => handleWeekOptionChange(weekOptionType, e.target.value)}>
                  <option value="">Select Week Option {index + 1}</option>
                  {weekOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="submit">Create Option</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <p>Option created successfully!</p>
      )}
    </div>
  );
}

export default CreateOption;
