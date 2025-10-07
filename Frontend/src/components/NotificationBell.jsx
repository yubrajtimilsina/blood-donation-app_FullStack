import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicRequest } from '../requestMethods';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchRecentNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchRecentNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await publicRequest.get('/notifications/unread-count', {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const res = await publicRequest.get('/notifications?limit=5', {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await publicRequest.put(`/notifications/${id}/read`, {}, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      fetchUnreadCount();
      fetchRecentNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-red-500 font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm ${getPriorityColor(notification.priority)}`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-gray-200">
              <Link
                to={`/${user.role}/notifications`}
                onClick={() => setShowDropdown(false)}
                className="block text-center text-sm text-red-500 hover:text-red-600 font-semibold"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;