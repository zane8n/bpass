import React from 'react';
import { StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';



export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {



  return (
    <View style={styles.container}>
      <EditScreenInfo path="payer" />
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
