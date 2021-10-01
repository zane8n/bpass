import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import  firebase from "firebase/app"
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxtSBvzEFNj6GS9PmjdTJ0VNtMR0Qq4Qc",
  authDomain: "bpass-bbb85.firebaseapp.com",
  databaseURL: "https://bpass-bbb85-default-rtdb.firebaseio.com",
  projectId: "bpass-bbb85",
  storageBucket: "bpass-bbb85.appspot.com",
  messagingSenderId: "81081224714",
  appId: "1:81081224714:web:253239d6ae1f4bc0b719f3",
  measurementId: "G-ZP0JFBK6YP"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
