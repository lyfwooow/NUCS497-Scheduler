// Import the functions you need from the SDKs you need
import { useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, onValue, ref, set } from 'firebase/database';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGNlppNNiaY8fjUFBUor6JWnn074qqk-o",
  auFhDomain: "nucs497-scheduler.firebaseapp.com",
  databaseURL: "https://nucs497-scheduler-default-rtdb.firebaseio.com",
  projectId: "nucs497-scheduler",
  storageBucket: "nucs497-scheduler.appspot.com",
  messagingSenderId: "774396441292",
  appId: "1:774396441292:web:00fd7bde8583ea9db50869",
  measurementId: "G-2TT3P5LH2N"
};

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const dbRef = ref(database, path);
        return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
        }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
        });
    }, [path, transform]);

    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
  };
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
