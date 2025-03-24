import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('UserId not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = () => {
    setLoading(true);
    setError(null);

    axios.get(`http://localhost:3000/notifications/${userId}`)
      .then((response) => {
        setNotifications(response.data);
        const count = response.data.filter((notif: Notification) => !notif.read).length;
        setUnreadCount(count);
        localStorage.setItem('unreadNotifications', count.toString());
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setError('Échec du chargement des notifications.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const markAsRead = (notificationId: string) => {
    axios.put(`http://localhost:3000/notifications/${notificationId}/read`)
      .then(() => {
        const updatedNotifications = notifications.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        );
        setNotifications(updatedNotifications);
        const newUnreadCount = updatedNotifications.filter(notif => !notif.read).length;
        setUnreadCount(newUnreadCount);
        localStorage.setItem('unreadNotifications', newUnreadCount.toString());
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  const markAllAsRead = () => {
    if (!userId || notifications.length === 0) return;
    
    axios.put(`http://localhost:3000/notifications/${userId}/read-all`)
      .then(() => {
        const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        localStorage.setItem('unreadNotifications', '0');
      })
      .catch((error) => {
        console.error('Error marking all notifications as read:', error);
      });
  };

  const deleteNotification = (notificationId: string) => {
    axios.delete(`http://localhost:3000/notifications/${notificationId}`)
      .then(() => {
        const updatedNotifications = notifications.filter(notif => notif._id !== notificationId);
        setNotifications(updatedNotifications);
        const newUnreadCount = updatedNotifications.filter(notif => !notif.read).length;
        setUnreadCount(newUnreadCount);
        localStorage.setItem('unreadNotifications', newUnreadCount.toString());
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex bg-amber-50 min-h-screen">
      <Sidebar />
      <div className="overflow-x-auto p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-amber-900 relative inline-block">
              Notifications
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-700"></div>
            </h2>
            <p className="text-amber-800 mt-2 italic">Restez informé de toutes vos activités</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
            <div className="flex justify-between items-center p-5 border-b border-amber-200 bg-amber-100">
              <div className="flex items-center space-x-3">
                <FaBell className="text-amber-700 text-xl" />
                <h3 className="text-xl font-medium text-amber-900">Centre de Notifications</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-amber-300">
                  {unreadCount} non lues
                </span>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition flex items-center gap-2"
                >
                  <FaCheck size={12} />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700 border-t-transparent"></div>
                <p className="mt-2 text-amber-800">Chargement des notifications...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                  <p>{error}</p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-8 text-amber-800">
                <FaBell className="text-amber-300 text-5xl mx-auto mb-4" />
                <p>Aucune notification disponible</p>
                <p className="mt-2 text-sm">Vous serez informé ici des activités importantes</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <ul className="divide-y divide-amber-100">
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      className="relative flex justify-between items-center hover:bg-amber-50 transition-colors duration-150 p-5"
                    >
                      <div className={`pl-5 flex-1 ${!notification.read ? 'font-medium' : ''}`}>
                        <p className="text-amber-900">{notification.message}</p>
                        <small className="text-xs text-amber-600">{formatDate(notification.createdAt)}</small>
                      </div>
                      <div className="flex gap-3">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification._id)}
                            className="px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition border border-amber-300"
                          >
                            Marquer comme lu
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notification._id)} className="text-red-600 hover:text-red-800 transition">
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
