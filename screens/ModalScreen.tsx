import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>À propos de nous</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/ModalScreen.tsx" /> */}
      <Text numberOfLines={10} style={styles.par}>
      Ce projet a été écrit et développé par Benjamin Aksanti et en partenariat avec Kikandi Safari. Ceci n'est qu'une version bêta de ce qui pourrait être une application très robuste dans un proche avenir probable. Toute personne souhaitant participer ou nous soutenir peut nous écrire à kikandi.safari@auca.ac.rw</Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <Text style={styles.foot}>bpass©2021 Allrights reserved {'\n'} made with{'\u2665'}by Ben&Key6 </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop:10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  par:{
    textAlign:'center',
    justifyContent: 'center'
  },
  foot:{
    top:250,
    textAlign:'center'
  }
});
