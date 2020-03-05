import {ICoordinate, Task} from '../data.module';
import * as Location from 'expo-location';
import {PermissionResponse} from "expo-location";

//TODO: set accuracy in settings
const trackingOptions = {
    distanceInterval: 20,
    accuracy: Location.Accuracy.Low,
    timeInterval: 3000,
};

export function requestPermissionAsync(): Promise<PermissionResponse> {
    return Location.requestPermissionsAsync();
}

export function getCurrentPosition(): Promise<ICoordinate> {
    return Location.getCurrentPositionAsync()
        .then(coordinate => {
            return {
                latitude: coordinate.coords.latitude,
                longitude: coordinate.coords.longitude
            };
        });
}

export function trackPositionInBackground() {
    Location.startLocationUpdatesAsync(Task.TRACK_ROUTE, trackingOptions).then();
}

export function stopTrackingPositionInBackground() {
    Location.stopLocationUpdatesAsync(Task.TRACK_ROUTE).then();
}

export function subscribeToPosition(callback: any): Promise<any> {
    return Location.watchPositionAsync(trackingOptions, callback);
}
