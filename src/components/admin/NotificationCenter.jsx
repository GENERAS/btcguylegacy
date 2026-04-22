// src/components/admin/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// Inline SVG icons - no external libraries
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const IconCheckCircle = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconMail = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IconXCircle = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconExternalLink = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const IconPhone = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.716 3 6V5z" />
  </svg>
)

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to new applications
    const subscription = supabase
      .channel('mentorship_applications_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'mentorship_applications' },
        (payload) => {
          addNotification({
            id: payload.new.id,
            type: 'new_application',
            title: 'New Mentorship Application',
            message: `${payload.new.full_name} applied for ${payload.new.service_title}`,
            data: payload.new,
            timestamp: new Date(),
            read: false
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    // Get pending verifications
    const { data: pendingApps } = await supabase
      .from('mentorship_applications')
      .select('*')
      .eq('payment_status', 'awaiting_verification')
      .limit(5);

    // Get new applications
    const { data: newApps } = await supabase
      .from('mentorship_applications')
      .select('*')
      .eq('status', 'new')
      .limit(5);

    const notifs = [];
    
    if (pendingApps) {
      pendingApps.forEach(app => {
        notifs.push({
          id: `pending-${app.id}`,
          type: 'pending_verification',
          title: 'Payment Pending Verification',
          message: `${app.full_name} - $${app.payment_amount}`,
          data: app,
          timestamp: new Date(app.submitted_at),
          read: false
        });
      });
    }
    
    if (newApps) {
      newApps.forEach(app => {
        notifs.push({
          id: `new-${app.id}`,
          type: 'new_application',
          title: 'New Application',
          message: `${app.full_name} - ${app.service_title}`,
          data: app,
          timestamp: new Date(app.submitted_at),
          read: false
        });
      });
    }
    
    setNotifications(notifs.slice(0, 10));
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'new_application':
        return <span className="text-blue-500"><IconMail /></span>;
      case 'pending_verification':
        return <span className="text-yellow-500"><IconClock /></span>;
      default:
        return <span className="text-gray-500"><IconBell /></span>;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <span className="text-gray-600"><IconBell /></span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition ${!notif.read ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.type === 'pending_verification') {
                      window.location.href = '/admin';
                    }
                  }}
                >
                  <div className="flex gap-3">
                    {getIcon(notif.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-t">
            <a
              href="/admin"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              Go to Admin Panel →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;