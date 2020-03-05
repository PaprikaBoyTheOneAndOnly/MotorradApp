import firebase from 'firebase';
import {IRoute, IRouteKey} from '../data.module';

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

export function logout() {
    return firebase.auth().signOut();
}

export function saveRoute(route: IRoute) {
    return firebase.database()
        .ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .push({...route});
}

export function getRoutesWithKey(): Promise<IRouteKey[]> {
    return firebase.database()
        .ref(`user/${firebase.auth().currentUser.uid}/routes`)
        .once('value')
        .then((snapshot) => {
            const routes = snapshot.val();
            if (routes === null) {
                return [];
            }

            return Object.keys(routes)
                .map((key) => {
                    const route = {};
                    route[key] = routes[key];
                    return route
                });
        });
}

export function getRoutes(): Promise<IRoute[]> {
    return this.getRoutesWithKey()
        .then((routesKey) => extractKeys(routesKey));
}

export const extractKeys = (routesKey: IRouteKey[]): IRoute[] => routesKey.map(routeKey => Object.values(routeKey)[0]);

export function deleteRoute(key: string) {
    return firebase.database()
        .ref(`user/${firebase.auth().currentUser.uid}/routes/${key}`)
        .remove();
}

export function onAuthChanged(callback) {
    firebase
        .auth()
        .onAuthStateChanged(callback);
}
