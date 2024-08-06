import React, { useState } from 'react';
import './TrainerSignUp.css'; // Importar el nuevo archivo de estilos

function TrainerSignUp({ onSignUpSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/signup/trainer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.username ? errorData.username[0] : 'Error en el registro');
      }

      const data = await response.json();
      onSignUpSuccess(data.token);
    } catch (error) {
      setError('Error al registrarse: ' + (error.message || 'Unknown error'));
      console.error(error);
    }
  };

  return (
    <div className="container-trainersignup mt-5">
      <div className="row-trainersignup">
        <div className="col-trainersignup">
          <div className="card-trainersignup">
            <div className="card-body">
              <h2 className="text-center">Registro de Entrenador</h2>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" id="username" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" id="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Password</label>
                  <input type="password" id="confirmPassword" className="form-control" placeholder="Confirmar Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Registrarse</button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerSignUp;
