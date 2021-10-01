import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>

      <EditScreenInfo path="verifier" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',


  },
  title: {
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center',

  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
