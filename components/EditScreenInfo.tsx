import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, Modal, Alert, View, Pressable, Vibration, Dimensions } from 'react-native';
import firebase from 'firebase/app'
import 'firebase/database'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
let etype
let edata
let sid
let found
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
  const [nam, setNam] = useState<String>("")
  const [address, setAddress] = useState<String>("")
  const [amount, setAmount] = useState<String>("")
  const [sex, setSex] = useState<String>("")
  const [institution, setInstitution] = useState<String>("")
  const [postNom, setpostNom] = useState<String>("")
  const [message, setMessage] = useState<String>("")
  const [info, setInfo] = useState<String>("")
  const ONE_SECOND_IN_MS = 500;
  const getter = firebase.database().ref('client/')
  const [type, setType] = useState<any>(BarCodeScanner.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      // getter.once('value', snapshot => {
      //   const val = snapshot.val()
      //   for (let id in val) {
      //     console.log(id + " | " + edata);
      //     if (id === edata) {
      //       console.log('found!');
      //       setVals(val[id])
      //       console.log(vals);
      //     } else {
      //       // console.log("Not found!");
      //       // break;
      //     }
      //   }
      // })
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
            found = 0
            for (let id in val) {
              console.log(id + " | " + edata);
              if (id === edata) {
                found = 1
                console.log('found!');
                setVals(val[id])
                console.log(vals);
                sid = id
                if (vals != null) {
                  payed(sid)
                } else {
                  setInfo(`Le résultat du code QR est corrompu, veuillez cliquer sur le bouton numériser à nouveau ci-dessous pour réessayer.`)
                  setModalVisible2(true)

                }
              } else {
                // console.log("Not found!");
                // break;


              }
              if(found == 0){
                setInfo(`Les résultats tirés de ce code QR ne correspondent à aucun enregistrement dans notre base de données. veuillez vérifier que la surface du code qr est propre et n'est pas rayée.`)
                setModalVisible2(true)
              }
            }
          })

        } else if (path == "verifier") {
          getter.once('value', snapshot => {
            const val = snapshot.val()
            found = 0
            for (let id in val) {
              console.log(id + " | " + edata);
              if (id === edata) {
                found = 1
                console.log('found!');
                setVals(val[id])
                console.log(vals);
                sid = id
                if (vals != null) {
                  vefd()
                } else {
                setInfo(`Le résultat du code QR est corrompu, veuillez cliquer sur le bouton numériser à nouveau ci-dessous pour réessayer.`)
                  setModalVisible2(true)

                }
              } else {
                // console.log("Not found!");
                // break;

              }
              if(found == 0){
                setInfo(`Les résultats tirés de ce code QR ne correspondent à aucun enregistrement dans notre base de données. veuillez vérifier que la surface du code qr est propre et n'est pas rayée.`)
                setModalVisible2(true)
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
    setNam(vals.nom)
    setpostNom(vals.post_nom)
    setAddress(vals.addresse)
    setSex(vals.sex)
    setInstitution(vals.institution)
    setAmount(vals.amount)
    setModalVisible(true)
    // setScanned(true)
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
      setNam(vals.nom)
      setpostNom(vals.post_nom)
      setAddress(vals.addresse)
      setSex(vals.sex)
      setInstitution(vals.institution)
      setAmount(vals.amount)
      setModalVisible(true)
    } else {
      setInfo(`Cette action ne peut pas être effectuée.
      Cause d'exception :\n SOLDE INSUFFISANT`)
      setModalVisible2(true)
    }


    // setScanned(true)
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
            <Text style={styles.modalText}>Noms: {nam} {postNom}</Text>
            <Text style={styles.modalText}>Address: {address}</Text>
            <Text style={styles.modalText}>Genre: {sex}</Text>
            <Text style={styles.modalText}>Institution: {institution}</Text>
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
            <Text style={styles.modalText}>{info}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible2(!modalVisible2)}
            >
              <Text style={styles.textStyle}>fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

   
            <Text style={styles.modalText}></Text>
           

    
            <Text style={styles.modalText}></Text>
            

    </>
  );
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
