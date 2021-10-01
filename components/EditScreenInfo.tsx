import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, Modal, Alert, View, Pressable, Vibration, Dimensions } from 'react-native';
import firebase from 'firebase/app'
import 'firebase/database'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
var etype
var edata
var sid

const finderWidth: number = 280;
const finderHeight: number = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

export default function EditScreenInfo({ path }: { path: string }) {
  const [hasPermission, setHasPermission] = useState<any | null>(null);
  const [scanned, setScanned] = useState(false);
  const [vals, setVals] = useState<any | null>(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [nam, setNam] = useState<String>("")
  const [address, setAddress] = useState<String>("")
  const [amount, setAmount] = useState<String>("")
  const [message, setMessage] = useState<String>("")
  const ONE_SECOND_IN_MS = 500;
  const getter = firebase.database().ref('client/')
  const [type, setType] = useState<any>(BarCodeScanner.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      getter.once('value', snapshot => {
        const val = snapshot.val()
        for (let id in val) {
          console.log(id + " | " + edata);
          if (id === edata) {
            console.log('found!');
            setVals(val[id])
            console.log(vals);
          } else {
            // console.log("Not found!");
            // break;
          }
        }
      })
    })();

  }, []);


  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    if (!scanned) {
      const { type, data, bounds: { origin } = {} } = scanningResult;
      // @ts-ignore
      const { x, y } = origin;
      if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
        setScanned(true);
        edata = data
        etype = type

        console.log();

        // getdata()
        if (data != undefined)
          Vibration.vibrate(1 * ONE_SECOND_IN_MS)



        if (path == "payer") {
          getter.once('value', snapshot => {
            const val = snapshot.val()
            for (let id in val) {
              console.log(id + " | " + edata);
              if (id === edata) {
                console.log('found!');
                setVals(val[id])
                console.log(vals);
                sid = id
                if (vals != null) {
                  payed(sid)
                } else {
                  setModalVisible3(true)

                }
              } else {
                // console.log("Not found!");
                // break;
              }
            }
          })

        } else if (path == "verifier") {
          getter.once('value', snapshot => {
            const val = snapshot.val()
            for (let id in val) {
              console.log(id + " | " + edata);
              if (id === edata) {
                console.log('found!');
                setVals(val[id])
                console.log(vals);
                sid = id
                if (vals != null) {
                  vefd()
                } else {
                  setModalVisible3(true)

                }
              } else {
                // console.log("Not found!");
                // break;
              }
            }
          })

        }
      }
    }
  };
  const vefd = () => {
    console.log(vals.amount);
    setMessage("Récupération des données réussie!")
    setNam(vals.name)
    setAddress(vals.address)
    setAmount(vals.amount)
    setModalVisible(true)
    setScanned(true)
  }
  const payed = (sid) => {
    console.log(vals.amount);
    console.log(sid);

    const newAmo = vals.amount - 500
    if (newAmo >= 0) {

      let amo_upd = firebase.database().ref(`client/${sid}/`)
      amo_upd.update({ amount: newAmo })
      setMessage("Le paiement a été effectué avec succès!")


      vals.amount = vals.amount - 500
      setNam(vals.name)
      setAddress(vals.address)
      setAmount(vals.amount)
      setModalVisible(true)
    } else {
      setModalVisible2(true)
    }


    setScanned(true)
  }
  if (hasPermission === null) {
    return <Text>loading...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Pas de camera disponible..</Text>;
  }

  return (
    <>


      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
        type={type}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>

        </View>
        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
        {scanned && <Button title={'numériser à nouveau'} onPress={() => setScanned(false)} />}

      </BarCodeScanner>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Info has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{message}</Text>
            <Text style={styles.modalText}>Noms: {nam}</Text>
            <Text style={styles.modalText}>Address: {address}</Text>
            <Text style={styles.modalText}>Balance: {amount}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>fermer</Text>
            </Pressable>
          </View>
        </View>

      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          Alert.alert("Info has been closed.");
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <Text style={styles.modalText}>Cette action ne peut pas être effectuée.
              Cause d'exception :{'\n'} SOLDE INSUFFISANT</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible2(!modalVisible2)}
            >
              <Text style={styles.textStyle}>fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => {
          Alert.alert("Info has been closed.");
          setModalVisible3(!modalVisible3);
        }}
      >
        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <Text style={styles.modalText}>Le résultat du code QR est corrompu, veuillez cliquer sur le bouton numériser à nouveau ci-dessous pour réessayer.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible3(!modalVisible3)}
            >
              <Text style={styles.textStyle}>fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </>
  );
}


export const datago = {
  edata, etype
}





const styles = StyleSheet.create({
  image: {
    flex: 1,
    // justifyContent: "center",
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    height: '100%',
    // opacity
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
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: 'center',
    alignContent: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
