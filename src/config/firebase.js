import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const readConfig = (key, fallback = "") =>
    (typeof window !== "undefined" && window.__CONNECT_CONFIG__?.[key]) || import.meta.env[key] || fallback;

const firebaseConfig = {
    apiKey: readConfig("VITE_FIREBASE_API_KEY"),
    authDomain: readConfig("VITE_FIREBASE_AUTH_DOMAIN"),
    databaseURL: readConfig("VITE_FIREBASE_DATABASE_URL"),
    projectId: readConfig("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readConfig("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readConfig("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readConfig("VITE_FIREBASE_APP_ID"),
    measurementId: readConfig("VITE_FIREBASE_MEASUREMENT_ID")
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);