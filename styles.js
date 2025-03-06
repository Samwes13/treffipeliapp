import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9090',
    paddingHorizontal: 20, // Suojaraja vasemmalle ja oikealle
    paddingVertical: 70,   // Suojaraja ylös ja alas
  },

  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },

  subtitle: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    
    textAlign: 'center', // Keskittää otsikon
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#FE9091',
    borderRadius: 25,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FE9091',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  helpIcon: {
    position: 'absolute',
    top: '10%',
    right: '8%',
    tintColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20, // Suojaraja modal-ikkunassa
  },
  modalContent: {
    width: '95%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    paddingTop: '13%',
    
  },
  closeButton: {
    marginTop: '5%',
    marginBottom: '5%',
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  logo: {
    position: 'absolute', // Asettaa logon absoluuttiseen sijaintiin
    top: 0, // Sijoittaa logon aivan ylös
    alignSelf: 'center', // Keskittää logon vaakasuunnassa
    width: '90%', // Voit säätää logon leveyttä
    height: 200, // Voit säätää logon korkeutta
    resizeMode: 'contain', // Pitää mittasuhteet oikeina
  },
  
  playerItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  playerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },


  roundText: {
    fontSize: 18,
    
    color: '#FFFFFF',
    marginBottom: 20,
  },
  traitText: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#FE9091',
    marginBottom: 15,

    textAlign: 'center',
    backgroundColor: '#FFFFFF', // Taustaväri
    padding: 19,                // Sisennys laatikon sisällä
    borderRadius: 14,
  },

  newtraitText: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 15,

    textAlign: 'center',

  },

  playerTextPlay: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 5,
    textAlign: 'center',
    marginBottom: 15,
  },
  

  playerAcceptedTraitset: {
    color: '#FFFFFF',         // Tekstin jakaminen riveille
    fontSize: 18,             // Määrittää, että tekstin leveys voi käyttää koko tilan
    textAlign: 'centered',         // Tekstin tasaus vasemmalle (voi olla myös 'center' tai 'right')
    marginVertical: 5,
  },

  buttonContainer: {
    flexDirection: 'row', // Asetetaan napit vierekkäin
    justifyContent: 'center', // Keskitetään napit
    marginTop: 20,
  },

  buttonYes: {
    backgroundColor: '80C938',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginRight: 20,
  },

  buttonNo: {
    backgroundColor: 'F65151',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

  },

  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },

  ///animaatio gameplay
animatedContainer: {
  position: 'absolute',
  top: '40%', // Asetetaan yläreuna 40% korkeudelle
  left: '50%', // Asetetaan vasen reuna 50% leveydelle
  transform: [{ translateX: -70 }, { translateY: -50 }], // Siirretään vasemmalle 100px ja ylöspäin 50px
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: 20,
  borderRadius: 10,
  zIndex: 10,
},

animationContainer: {
  position: 'absolute',
  top: '40%', // Asetetaan yläreuna 50% korkeudelle
  left: '50%', // Asetetaan vasen reuna 50% leveydelle
  width: 200,
  height: 100,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 20,
  overflow: 'hidden',
  zIndex: 5,
  transform: [{ translateX: -70 }, { translateY: -50 }], // Siirretään vasemmalle 100px ja ylöspäin 50px
},

animatedText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},

animationBackground: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

animationText: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},

});

export default styles;
