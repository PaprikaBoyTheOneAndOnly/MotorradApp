import firebase from 'firebase';
import {IRoute, IRouteKey} from '../data.module';

const firebaseConfig = {
    apiKey: 'AIzaSyACirAt4NmsMVi8gsDrBzteZh3Ms2oROBY',
    projectId: 'motorradapp-267508',
    databaseURL: 'https://motorradapp-267508.firebaseio.com',
    storageBucket: 'gs://motorradapp-267508.appspot.com',
};

export function initialize() {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) { }
}

export function signUp(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
    return firebase.auth().signOut();
}

export function saveRoute(route: IRoute) {
    return firebase.database()
        .ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .push({...route});
}

export function onRoutesWithKey(callback: Function) {
    firebase.database()
        .ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .on('value', (snapshot) => {
            const routes = snapshot.val();
            callback(routes === null ? [] :
                Object.keys(routes)
                    .map(key => ({[key]: routes[key]})));
        });
}

export function onRoutes(callback: Function) {
    this.onRoutesWithKey((routesKey) => callback(extractKeys(routesKey)));
}

export const extractKeys = (routesKey: IRouteKey[]): IRoute[] => routesKey.map(routeKey => Object.values(routeKey)[0]);

export async function savePhoto(uri: string, name: string, route: string, progressCallback: Function): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const task = firebase.storage()
            .ref(`${firebase.auth().currentUser.uid}/${route}/${name}.jpg`)
            .put(blob);

        task.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => progressCallback((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (err) => reject(err),
            () => {
                task.snapshot.ref.getDownloadURL()
                    .then((url) => resolve(url))
                    .catch(e => reject(e));
            }
        )
    });
}

export function extractNameOfPhoto(url: string): string {
    const index = url.indexOf('.jpg');
    return url.substring(index - 32, index + 4);
}

export async function deletePhoto(routName: string, name: string): Promise<any> {
    return firebase.storage()
        .ref(`${firebase.auth().currentUser.uid}/${routName}/${name}`)
        .delete();
}

export function deleteRoute(key: string, route: IRoute): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (route.photos) {
                const photos = route.photos.map(photo => extractNameOfPhoto(photo.url));
                for (let name of photos) {
                    try {
                        await deletePhoto(route.name, name);
                    } catch (e) {
                        if(e.code !== 'storage/object-not-found') {
                            reject(e);
                        }
                    }
                }
            }
            await firebase.database()
                .ref(`user/${firebase.auth().currentUser.uid}/routes/${key}`)
                .remove();

            resolve();
        } catch (e) {
            reject(e)
        }
    });
}

export function onAuthChanged(callback) {
    firebase
        .auth()
        .onAuthStateChanged(callback);
}
