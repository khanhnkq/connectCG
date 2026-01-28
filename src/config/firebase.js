import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyClHm3NH9u4UJdPG7xNdN-JNyL3_ewZOh4",
    authDomain: "chat-real-time-88b52.firebaseapp.com",
    databaseURL: "https://chat-real-time-88b52-default-rtdb.firebaseio.com",
    projectId: "chat-real-time-88b52",
    storageBucket: "chat-real-time-88b52.firebasestorage.app",
    messagingSenderId: "338964961559",
    appId: "1:338964961559:web:391eb8e1b1974d3df23f52",
    measurementId: "G-BZ8T9PE18H"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);