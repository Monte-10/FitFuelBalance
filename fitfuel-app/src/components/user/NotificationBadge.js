import React, { useState, useEffect, useRef } from 'react';
import { Badge, Dropdown, ListGroup } from 'react-bootstrap';
import './NotificationBadge.css';

const NotificationBadge = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Obtener el rol del usuario desde localStorage o context
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // Decodificar el token para obtener el rol (simplificado)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role || 'regular_user');
            } catch (error) {
                setUserRole('regular_user');
            }
        }

        // Solo mostrar notificaciones para clientes (regular_user)
        if (userRole === 'regular_user') {
            const mockNotifications = [
                {
                    id: 1,
                    title: 'Plan de entrenamiento actualizado',
                    message: 'Tu entrenador ha actualizado tu plan semanal',
                    is_read: false,
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 2,
                    title: 'Nueva medida registrada',
                    message: 'Se ha registrado una nueva medida corporal',
                    is_read: true,
                    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 3,
                    title: 'Recordatorio de entrenamiento',
                    message: 'Tienes un entrenamiento programado para mañana',
                    is_read: false,
                    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                }
            ];

            setNotifications(mockNotifications);
            setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
        }
    }, [userRole]);

    // Auto-marcar como leídas después de 5 segundos de estar abierto
    useEffect(() => {
        let timer;
        if (isOpen && unreadCount > 0) {
            timer = setTimeout(() => {
                markAllAsRead();
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [isOpen, unreadCount]);

    // Si es entrenador, no mostrar nada
    if (userRole === 'trainer') {
        return null;
    }

    const markAsRead = async (notificationId) => {
        try {
            setLoading(true);
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notificationId ? { ...n, is_read: true } : n
                )
            );
            
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setNotifications(prev => 
                prev.map(n => ({ ...n, is_read: true }))
            );
            
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDropdownToggle = (isOpen) => {
        setIsOpen(isOpen);
        // Si se abre y hay notificaciones no leídas, marcarlas como leídas después de 3 segundos
        if (isOpen && unreadCount > 0) {
            setTimeout(() => {
                markAllAsRead();
            }, 3000);
        }
    };

    const handleNotificationHover = (notificationId) => {
        // Marcar como leída al hacer hover si no está leída
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.is_read) {
            markAsRead(notificationId);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Hace unos minutos';
        if (diffInHours < 24) return `Hace ${diffInHours} horas`;
        if (diffInHours < 48) return 'Ayer';
        return date.toLocaleDateString();
    };

    return (
        <Dropdown 
            className="notification-dropdown" 
            align="end" 
            onToggle={handleDropdownToggle}
            ref={dropdownRef}
        >
            <Dropdown.Toggle variant="link" className="notification-toggle">
                <span className="notification-icon">🔔</span>
                {unreadCount > 0 && (
                    <Badge 
                        bg="danger" 
                        className="notification-badge"
                        pill
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="notification-menu">
                <div className="notification-header">
                    <h6 className="mb-0">
                        🔔 Notificaciones
                        {unreadCount > 0 && (
                            <span className="unread-indicator">
                                ({unreadCount} nueva{unreadCount > 1 ? 's' : ''})
                            </span>
                        )}
                    </h6>
                    {unreadCount > 0 && (
                        <button
                            className="btn btn-link btn-sm text-decoration-none mark-all-read-btn"
                            onClick={markAllAsRead}
                            disabled={loading}
                        >
                            {loading ? '⏳' : '✓ Marcar todas'}
                        </button>
                    )}
                </div>
                
                <div className="notification-list">
                    {notifications.length === 0 ? (
                        <div className="no-notifications">
                            <p className="text-muted mb-0">No hay notificaciones</p>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {notifications.map(notification => (
                                <ListGroup.Item 
                                    key={notification.id}
                                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                                    onMouseEnter={() => handleNotificationHover(notification.id)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {!notification.is_read && (
                                                <span className="unread-dot">●</span>
                                            )}
                                            {notification.title}
                                        </div>
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatTime(notification.created_at)}
                                        </div>
                                    </div>
                                    
                                    {!notification.is_read && (
                                        <button
                                            className="btn btn-link btn-sm mark-read-btn"
                                            onClick={() => markAsRead(notification.id)}
                                            disabled={loading}
                                            title="Marcar como leída"
                                        >
                                            {loading ? '⏳' : '✓'}
                                        </button>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBadge;
