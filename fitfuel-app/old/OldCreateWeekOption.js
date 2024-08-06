import React, { useState, useEffect } from 'react';

function CreateWeekOption() {
  const [name, setName] = useState('');
  const [selectedDayOptions, setSelectedDayOptions] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [dayOptions, setDayOptions] = useState([]);
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('${apiUrl}/nutrition/dayoptions/', {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
      .then(response => response.json())
      .then(data => setDayOptions(data))
      .catch(error => {
        console.error('Error fetching day options:', error);
        setError('Failed to fetch day options. Please refresh the page.');
      });
  }, []);

  const handleDayOptionChange = (day, value) => {
    setSelectedDayOptions({ ...selectedDayOptions, [day]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const weekOptionData = {
        name,
        monday_option: selectedDayOptions.monday,
        tuesday_option: selectedDayOptions.tuesday,
        wednesday_option: selectedDayOptions.wednesday,
        thursday_option: selectedDayOptions.thursday,
        friday_option: selectedDayOptions.friday,
        saturday_option: selectedDayOptions.saturday,
        sunday_option: selectedDayOptions.sunday,
      };

    console.log("Sending week option data", weekOptionData);

    fetch('${apiUrl}/nutrition/weekoptions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
      body: JSON.stringify(weekOptionData),
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
      console.error('Error creating week option:', error);
      setError('Failed to create week option. Please try again.');
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
              placeholder="Week Option Name"
            />
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day}>
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                <select value={selectedDayOptions[day]} onChange={(e) => handleDayOptionChange(day, e.target.value)}>
                  <option value="">Select Option for {day}</option>
                  {dayOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="submit">Create Week Option</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <p>Week Option created successfully!</p>
      )}
    </div>
  );
}

export default CreateWeekOption;
