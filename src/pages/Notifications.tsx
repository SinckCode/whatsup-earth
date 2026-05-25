import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import UserAreaNav from '../components/account/UserAreaNav';
import '../styles/pages/NotificationsPage.scss';

export default function Notifications() {
  const { user } = useAuth();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const typeIcons: Record<string, string> = {
    alert_triggered: '🔔',
    event_update: '🌍',
    system: '⚙️',
  };

  const typeLabels: Record<string, string> = {
    alert_triggered: 'Alerta',
    event_update: 'Evento',
    system: 'Sistema',
  };

  return (
    <section className="notifications-page">
      <UserAreaNav />

      <div className="notifications-page__header">
        <h1>Notificaciones</h1>
        {unreadCount > 0 && (
          <button
            className="notifications-page__btn-read-all"
            onClick={() => markAllAsRead()}
          >
            Marcar todas como leídas ({unreadCount})
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="notifications-page__loading">Cargando notificaciones...</p>
      ) : notifications.length === 0 ? (
        <div className="notifications-page__empty">
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        <ul className="notifications-page__list">
          {notifications.map((n: any) => (
            <li
              key={n.id}
              className={`notifications-page__item ${!n.isRead ? 'notifications-page__item--unread' : ''}`}
            >
              <div className="notifications-page__item-icon">
                {typeIcons[n.type] || '📌'}
              </div>
              <div className="notifications-page__item-content">
                <div className="notifications-page__item-header">
                  <span className="notifications-page__item-type">
                    {typeLabels[n.type] || n.type}
                  </span>
                  <span className="notifications-page__item-date">
                    {new Date(n.createdAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h3 className="notifications-page__item-title">{n.title}</h3>
                <p className="notifications-page__item-message">{n.message}</p>
              </div>
              <div className="notifications-page__item-actions">
                {!n.isRead && (
                  <button
                    className="notifications-page__btn-read"
                    onClick={() => markAsRead(n.id)}
                    title="Marcar como leída"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="notifications-page__btn-delete"
                  onClick={() => deleteNotification(n.id)}
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
