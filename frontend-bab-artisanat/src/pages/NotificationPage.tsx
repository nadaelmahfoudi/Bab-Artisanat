import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { FaBell, FaCheck } from 'react-icons/fa';

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
        // Count unread notifications
        const count = response.data.filter((notif: Notification) => !notif.read).length;
        setUnreadCount(count);
        // Store the count in localStorage for the sidebar to access
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
        // Update local notifications state
        const updatedNotifications = notifications.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        );
        setNotifications(updatedNotifications);
        
        // Update unread count
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FaBell className="text-amber-600 text-xl" />
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} non lues
                </span>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaCheck size={12} />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <FaBell className="text-gray-300 text-5xl mx-auto mb-4" />
                  <p className="text-gray-500">Aucune notification disponible</p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`relative hover:bg-amber-50 transition-colors duration-150 ${
                      !notification.read ? 'bg-amber-50' : 'bg-white'
                    }`}
                  >
                    <div className="p-5">
                      {!notification.read && (
                        <span className="absolute left-0 top-5 h-2 w-2 bg-amber-500 rounded-full ml-2"></span>
                      )}
                      <div className={`pl-5 ${!notification.read ? 'font-medium' : ''}`}>
                        <p className="text-gray-800">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <small className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </small>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-xs text-amber-600 hover:text-amber-800"
                            >
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;