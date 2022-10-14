// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJJVAR2_S6rTnmuAC_anBN6NV4OAdnd0I",
    authDomain: "web-sea-food.firebaseapp.com",
    databaseURL: "https://web-sea-food.firebaseio.com",
    projectId: "web-sea-food",
    storageBucket: "web-sea-food.appspot.com",
    messagingSenderId: "351172669160",
    appId: "1:351172669160:web:f84f16d76c8af6dab6235d",
    measurementId: "G-GP1SWVDMFC"
};

export const LYRIC_TEMP_PICTURE_BUCK = "/lyrics/temp/pictures/";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const fireBaseDatabase = getFirestore(app);
export const fireBaseStorage = getStorage(app);
// export const analytics = getAnalytics(app);