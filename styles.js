import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Kattaa koko näytön
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#845AFE',
    paddingHorizontal: 20, // Suojaraja vasemmalle ja oikealle
    paddingVertical: 70,   // Suojaraja ylös ja alas
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
    fontSize: 29,
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerTextPlay: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 5,
    textAlign: 'center',
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

});

export default styles;
