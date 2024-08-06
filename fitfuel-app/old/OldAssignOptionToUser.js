import React, { useState, useEffect } from 'react';

function AssignOptionToUser() {
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUsersAndOptions = async () => {
      try {
        const usersResponse = await fetch('${apiUrl}/user/regularusers/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const optionsResponse = await fetch('${apiUrl}/nutrition/options/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        if (!usersResponse.ok || !optionsResponse.ok) throw new Error('Failed to fetch data');

        const usersData = await usersResponse.json();
        const optionsData = await optionsResponse.json();
        setUsers(usersData);
        setOptions(optionsData);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchUsersAndOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('${apiUrl}/nutrition/assignOption/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          userId: selectedUser,
          optionId: selectedOption,
          startDate: selectedDate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to assign option: ${errorText}`);
      }

      setSuccess(true); // Establecer el éxito de la operación
      setError('');

    } catch (error) {
      setError(`Failed to assign option. Please try again. Error: ${error.message}`);
      setSuccess(false);
    }
    
  };

  return (
    <div>
      <h2>Assign Option to User</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Option assigned successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User:</label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Option:</label>
          <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value="">Select Option</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button type="submit">Assign Option</button>
      </form>
    </div>
  );
}

export default AssignOptionToUser;
