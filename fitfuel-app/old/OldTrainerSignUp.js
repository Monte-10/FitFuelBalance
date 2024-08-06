import React, { useState } from 'react';

function TrainerSignUp({ onSignUpSuccess }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para la confirmación de contraseña
    const [error, setError] = useState('');
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return; // Detener la ejecución si las contraseñas no coinciden
        }

        try {
            const response = await fetch('${apiUrl}/user/signup/trainer/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password }),
            });
          
            if (!response.ok) {
              throw new Error('Error en el registro');
            }
          
            const data = await response.json();
            onSignUpSuccess(data.token); // Asumiendo que el backend devuelve un token
          } catch (error) {
            setError('Error al registrarse');
            console.error(error);
          }
    };

    return (
        <div>
            <h2>Registro de Entrenador</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Registrarse</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}
    
export default TrainerSignUp;
