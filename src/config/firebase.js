import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const runtimeConfig =
    typeof window !== "undefined" ? window.__CONNECT_CONFIG__ || {} : {};

const firebaseConfig = {
    apiKey: runtimeConfig.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: runtimeConfig.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: runtimeConfig.VITE_FIREBASE_DATABASE_URL || import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
    projectId: runtimeConfig.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: runtimeConfig.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: runtimeConfig.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: runtimeConfig.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: runtimeConfig.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

let app = null;
let db = null;
let analytics = null;

try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
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
    } else {
        console.warn("Firebase configuration is missing or incomplete (check VITE_FIREBASE_* env vars).");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { app, db, analytics };