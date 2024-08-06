import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdaptOption.css'; // Import the CSS file

const AdaptOption = () => {
    const [options, setOptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [newOptionName, setNewOptionName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/nutrition/options/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setOptions(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError('Error fetching options');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/regularusers/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setUsers(Array.isArray(response.data.results) ? response.data.results : []);
            } catch (error) {
                setError('Error fetching users');
            }
        };

        fetchOptions();
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/nutrition/adapt-option/`, {
                new_option_name: newOptionName,
                option_id: selectedOption,
                user_id: selectedUser
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess('Option adapted successfully!');
        } catch (error) {
            setError(error.response?.data?.error || 'Error adapting option');
            console.error('Error adapting option:', error.response?.data || error.message);
        }
    };

    return (
        <div className="adapt-option-container mt-4">
            <h2>Adapt Option</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="newOptionName" className="form-label">New Option Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="newOptionName"
                        value={newOptionName}
                        onChange={(e) => setNewOptionName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="selectUser" className="form-label">Select User</label>
                    <select
                        className="form-select"
                        id="selectUser"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="selectOption" className="form-label">Select Option</label>
                    <select
                        className="form-select"
                        id="selectOption"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        required
                    >
                        <option value="">Select an option</option>
                        {options.map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Adapt Option</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
            </form>
        </div>
    );
};

export default AdaptOption;
