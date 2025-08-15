import { useState, useEffect, useCallback } from 'react';

export const useServiceWorker = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showReload, setShowReload] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if service workers are supported
  const isSupported = 'serviceWorker' in navigator;

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(newWorker);
            setShowReload(true);
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowReload(false);
        setWaitingWorker(null);
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }, [isSupported]);

  // Skip waiting and activate new service worker
  const skipWaiting = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowReload(false);
      setWaitingWorker(null);
    }
  }, [waitingWorker]);

  // Reload page after service worker update
  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Send push notification
  const sendPushNotification = useCallback(async (title, options = {}) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/golden-basket-rounded.png',
        badge: '/golden-basket-rounded.png',
        vibrate: [100, 50, 100],
        ...options,
      });
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VAPID_PUBLIC_KEY,
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPushNotifications = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }, []);

  // Check if app is installed (PWA)
  const isAppInstalled = useCallback(() => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }, []);

  // Install app as PWA
  const installApp = useCallback(async () => {
    if (!('BeforeInstallPromptEvent' in window)) {
      return false;
    }

    // This would typically be handled by a beforeinstallprompt event listener
    // For now, we'll return false
    return false;
  }, []);

  return {
    // Service worker state
    isSupported,
    showReload,
    isOnline,

    // Actions
    registerServiceWorker,
    skipWaiting,
    reloadPage,
    requestNotificationPermission,
    sendPushNotification,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    installApp,

    // Status
    isAppInstalled: isAppInstalled(),
  };
};

export default useServiceWorker;
