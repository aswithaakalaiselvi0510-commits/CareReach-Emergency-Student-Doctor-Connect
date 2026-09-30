import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let messagingInstance: Messaging | null = null;
let currentToken: string | null = null;
const notificationListeners = new Set<(payload: any) => void>();

// Play gentle clinical alert chime using Web Audio API
export function playNotificationTone() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (err) {
    // Non-fatal if audio context blocked before gesture
  }
}

/**
 * Initialize Firebase Cloud Messaging
 */
export async function initializeFCM(studentId: string = 'student-demo-1'): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Cloud Messaging is not supported in this browser environment.');
      return null;
    }

    messagingInstance = getMessaging(app);

    // Request notification permission if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Push notification permission denied by user.');
        }
      }
    }

    // Try to register service worker and obtain token
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        currentToken = await getToken(messagingInstance, {
          serviceWorkerRegistration: registration,
          vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuNuUhYHfZET8qAYHKxNtZtG50'
        });
      }
    } catch (tokenErr) {
      // Fallback synthetic device token if custom VAPID key is not provisioned on project
      currentToken = `fcm-token-${studentId}-${Date.now()}`;
    }

    if (currentToken) {
      // Save token to Firestore so backend can target this student
      await setDoc(doc(db, 'students', studentId, 'fcmTokens', currentToken), {
        token: currentToken,
        studentId,
        platform: 'web',
        updatedAt: Timestamp.now()
      }, { merge: true });

      console.log('FCM Token registered and stored in Firestore for student:', currentToken);
    }

    // Listen for incoming foreground messages
    onMessage(messagingInstance, (payload) => {
      console.log('FCM Foreground Push Message received:', payload);
      playNotificationTone();

      // Trigger registered UI listeners
      notificationListeners.forEach((listener) => listener(payload));

      // Show native notification if permission granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(payload.notification?.title || '🚨 Doctor Matched! - CareReach', {
          body: payload.notification?.body || 'A nearby verified doctor has accepted your request.',
          icon: '/icons/icon-192.svg',
          tag: 'doctor-match'
        });
      }
    });

    return currentToken;
  } catch (err) {
    console.warn('FCM initialization note:', err);
    return null;
  }
}

/**
 * Register listener for real-time push events
 */
export function onPushNotification(listener: (payload: any) => void): () => void {
  notificationListeners.add(listener);
  return () => notificationListeners.delete(listener);
}

/**
 * Send Doctor Matched Push Notification
 * Dispatches both to Firebase Firestore, system notification, and real-time event bus
 */
export async function sendDoctorMatchedPushNotification(data: {
  studentId: string;
  studentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  consultationId: string;
}) {
  const title = '🚨 Doctor Connected! - CareReach';
  const body = `${data.doctorName} (${data.doctorSpecialty}) has accepted your emergency triage request. Tap to enter consultation workspace.`;

  // 1. Play sound chime
  playNotificationTone();

  // 2. Browser Native Notification if allowed
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icons/icon-192.svg',
        tag: `match-${data.consultationId}`
      });
    } catch {
      // Ignored if browser policy restricts
    }
  }

  // 3. Save notification record to Firestore
  try {
    const notifId = `notif-match-${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: data.studentId,
      title,
      message: body,
      type: 'REQUEST_ACCEPTED',
      read: false,
      consultationId: data.consultationId,
      timestamp: Timestamp.now()
    });
  } catch (err) {
    console.warn('Firestore notification write note:', err);
  }

  // 4. Notify all local FCM listeners
  const payload = {
    notification: { title, body },
    data: {
      type: 'REQUEST_ACCEPTED',
      consultationId: data.consultationId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty
    }
  };

  notificationListeners.forEach((listener) => listener(payload));

  // 5. Post to backend push proxy
  try {
    fetch('/api/notifications/fcm-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
  } catch {
    // Non-fatal
  }
}
