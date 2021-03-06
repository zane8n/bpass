import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, Modal, Alert, View, Pressable, Vibration, Dimensions,TextInput,SafeAreaView } from 'react-native';
import firebase from 'firebase/app'
import 'firebase/database'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import Login from './Login';
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
  const [showlogin, setShowlogin] = useState(false);
  const [nam, setNam] = useState<String>("")
  const [usr, setUsr] = useState("")
  const [pwd, setPwd] = useState("")
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
    })();

  }, []);
function reload(sid){
  firebase.database().ref('client/' + sid).once('value', snapshot => {
    const val = snapshot.val()
    setVals(val)
  })
}

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
                  setInfo(`Le r??sultat du code QR est corrompu, veuillez cliquer sur le bouton num??riser ?? nouveau ci-dessous pour r??essayer.`)
                  setModalVisible2(true)

                }
              } else {
                // console.log("Not found!");
                // break;


              }
              if(found == 0){
                setInfo(`Les r??sultats tir??s de ce code QR ne correspondent ?? aucun enregistrement dans notre base de donn??es. veuillez v??rifier que la surface du code qr est propre et n'est pas ray??e.`)
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
                  vefd(sid)
                } else {
                setInfo(`Le r??sultat du code QR est corrompu, veuillez cliquer sur le bouton num??riser ?? nouveau ci-dessous pour r??essayer.`)
                  setModalVisible2(true)

                }
              } else {
                // console.log("Not found!");
                // break;

              }
              if(found == 0){
                setInfo(`Les r??sultats tir??s de ce code QR ne correspondent ?? aucun enregistrement dans notre base de donn??es. veuillez v??rifier que la surface du code qr est propre et n'est pas ray??e.`)
                setModalVisible2(true)
              }
            }
          })

        }
      }
    }
  };
  const vefd = (sid) => {
    reload(sid)
    console.log(vals.amount);
    setMessage("R??cup??ration des donn??es r??ussie!")
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
    console.log("is: " + vals.amount);
    console.log(sid);
reload(sid)
console.log(vals.amount);

    if (vals.amount >= 0) {
   vals.amount = vals.amount - 500
      let dt = new Date()
      console.log(dt);
      
      let amo_upd = firebase.database().ref(`client/${sid}/`)
      amo_upd.update({ amount: vals.amount })
      let rec_set = firebase.database().ref(`recs/${dt}/`)
        rec_set.set({
          id: `${sid}`,
          noms: `${vals.nom} ${vals.post_nom}`,
          amount: 500

        })
      setMessage("Le paiement a ??t?? effectu?? avec succ??s!")


      // vals.amount = vals.amount - 500
      setNam(vals.nom)
      setpostNom(vals.post_nom)
      setAddress(vals.addresse)
      setSex(vals.sex)
      setInstitution(vals.institution)
      setAmount(vals.amount)
      setModalVisible(true)
    } else {
      setInfo(`Cette action ne peut pas ??tre effectu??e.
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
  const login = () => {

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
        <BarcodeMask edgeColor="#62B1F6"  />
        {scanned && <Button title={'num??riser ?? nouveau'} onPress={() => setScanned(false)} />}

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
            
           
<Login/>
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
  },
  form: {
    alignItems: 'center',
    backgroundColor: 'rgb(58, 58, 60)',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    width: 80,
  },input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
