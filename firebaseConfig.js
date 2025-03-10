import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {
	getAuth,
	initializeAuth,
	getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: "AIzaSyARc16dT_KitZSA3Yj9n51cV8zDezx1PC8",
	authDomain: "expensetrackerapp-5e580.firebaseapp.com",
	projectId: "expensetrackerapp-5e580",
	storageBucket: "expensetrackerapp-5e580.firebasestorage.app",
	messagingSenderId: "271949458498",
	appId: "1:271949458498:web:5d63e4a993aca01526d1db",
};

const app = initializeApp(firebaseConfig);
// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export {app, auth, db};
