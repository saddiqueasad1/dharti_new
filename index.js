import { AppRegistry, Platform } from "react-native";
import { registerRootComponent } from "expo";
import App from "./src";
import { name as appName } from "./app.json";
registerRootComponent(App);
const firebaseConfig = {
  apiKey: "AIzaSyBfTQ7IigRYXnp0DExoeutidqdN2xfljM0",
  authDomain: "dharti-a72bd.firebaseapp.com",
  databaseURL: "https://dharti-a72bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dharti-a72bd",
  storageBucket: "dharti-a72bd.appspot.com",
  messagingSenderId: "606808017425",
  appId: "1:606808017425:web:eb841f4c5e173f55dfffb0",
  measurementId: "G-E842D275X3"
};

import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
}
export default database = getDatabase();
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens(); // Enable screens for better performance
