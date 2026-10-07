import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const readConfig = (key, fallback = "") =>
    (typeof window !== "undefined" && window.__CONNECT_CONFIG__?.[key]) || import.meta.env[key] || fallback;

const firebaseConfig = {
    apiKey: readConfig("VITE_FIREBASE_API_KEY", "AIzaSyClHm3NH9u4UJdPG7xNdN-JNyL3_ewZOh4"),
    authDomain: readConfig("VITE_FIREBASE_AUTH_DOMAIN", "chat-real-time-88b52.firebaseapp.com"),
    databaseURL: readConfig("VITE_FIREBASE_DATABASE_URL", "https://chat-real-time-88b52-default-rtdb.firebaseio.com"),
    projectId: readConfig("VITE_FIREBASE_PROJECT_ID", "chat-real-time-88b52"),
    storageBucket: readConfig("VITE_FIREBASE_STORAGE_BUCKET", "chat-real-time-88b52.firebasestorage.app"),
    messagingSenderId: readConfig("VITE_FIREBASE_MESSAGING_SENDER_ID", "338964961559"),
    appId: readConfig("VITE_FIREBASE_APP_ID", "1:338964961559:web:391eb8e1b1974d3df23f52"),
    measurementId: readConfig("VITE_FIREBASE_MEASUREMENT_ID", "G-BZ8T9PE18H")
};

let app = null;
let db = null;
let analytics = null;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getDatabase(app);
    if (typeof window !== "undefined") {
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        }).catch((err) => {
            console.warn("Firebase Analytics not supported in this environment:", err);
        });
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { app, db, analytics };