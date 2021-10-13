import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Modal,Text } from 'react-native';

export default class App extends Component<any,any> {
  constructor(props) {
    super(props);
    
    this.state = {
      usr: '',
      pwd: '',
      showlogin:true
    };
  this.onLogin = this.onLogin.bind(this)
  this.handleUsr = this.handleUsr.bind(this)
  this.handlePwd = this.handlePwd.bind(this)
  }
  handleUsr(e){
    this.setState({usr: e})
  }
  handlePwd(e){
    this.setState({pwd: e})
  }
  onLogin() {
    // const { username, password } = this.state;
if((this.state.usr == 'Admin') && (this.state.pwd == 'Admin')){
  this.setState({showlogin: false})
}
else{
  Alert.alert('Erreur de connexion', `Vous avez entré un nom d'utilisateur ou un mot de passe invalide.`);
}
}

  render() {
    return (
      <>
        <Modal
        animationType="slide"
        transparent={false}
        presentationStyle='fullScreen'
        visible={this.state.showlogin}
        onRequestClose={() => {
          Alert.alert("Info has been closed.");
          this.setState({showlogin: !this.state.showlogin});
        }}
      >
        
        <View style={styles.centeredView}>
        <Text style={{top:10}}>Bienvenue sur bpass, veuillez vous connecter.</Text>

          <View style={styles.modalView}>
        <TextInput
          value={this.state.usr}
          onChangeText={this.handleUsr}
          placeholder={'nom d\'utilisateur'}
          style={styles.input}
        />
        <TextInput
          value={this.state.pwd}
          onChangeText={this.handlePwd}
          placeholder={'mot de passe '}
          secureTextEntry={true}
          style={styles.input}
        />
        
        <Button
          title={'Login'}
          // style={styles.input}
          onPress={this.onLogin}
        ></Button>

          </View>
        </View>
      </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});