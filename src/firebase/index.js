import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBQ1lWW5z6N7vJya-i_zOj5CuH21K_vK6U',
  authDomain: 'family3-14224.firebaseapp.com',
  databaseURL: 'https://family3-14224.firebaseio.com',
  projectId: 'family3-14224',
  storageBucket: 'family3-14224.appspot.com',
  messagingSenderId: '270636768402'
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firestore = firebaseApp.firestore()
export const auth = firebaseApp.auth()
