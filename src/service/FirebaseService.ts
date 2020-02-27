import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyACirAt4NmsMVi8gsDrBzteZh3Ms2oROBY",
    projectId: "motorradapp-267508",
    databaseURL: "https://motorradapp-267508.firebaseio.com",
};

export function initialize() {
    firebase.initializeApp(firebaseConfig);
}

export async function getUsers() {
    const db = firebase.firestore();
    const response = await db.collection('user').get();
    console.log(response);
}
