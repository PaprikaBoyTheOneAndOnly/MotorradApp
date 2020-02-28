import firebase from 'firebase';
import {IRoute} from '../data.module';

const firebaseConfig = {
    apiKey: 'AIzaSyACirAt4NmsMVi8gsDrBzteZh3Ms2oROBY',
    projectId: 'motorradapp-267508',
    databaseURL: 'https://motorradapp-267508.firebaseio.com',
};

export function initialize() {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
    }
}

export function signUp(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function saveRoute(route: IRoute) {
    return firebase.database().ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .push({...route});
}

export function getRoutes(): Promise<IRoute[]> {
    return firebase.database().ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .once('value')
        .then((snapshot) => Object.values(snapshot.val()));
}

export function onAuthChanged(callback) {
    firebase
        .auth()
        .onAuthStateChanged(callback);
}
