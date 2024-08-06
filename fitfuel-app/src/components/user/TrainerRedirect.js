import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerRedirect({ authToken, userRole }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken && userRole === 'trainer') {
            navigate('/trainer-clients');
        }
    }, [authToken, userRole, navigate]);

    return null; // Este componente no renderiza nada
}

export default TrainerRedirect;
