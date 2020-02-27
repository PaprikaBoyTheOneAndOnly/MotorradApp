import { ICoordinate, Task } from '../data.module';
import * as Location from 'expo-location';

//TODO: change timout depends on the speed
//TODO: set accuracy in settings
//TODO: change distanceInterval (1 is just for testing)
const trackingOptions = {
    distanceInterval: 1,
    accuracy: Location.Accuracy.Low
};

export function getCurrentPosition(): Promise<ICoordinate> {
    return Location.getCurrentPositionAsync()
        .then(coordinate => {
                  return {
                      latitude: coordinate.coords.latitude,
                      longitude: coordinate.coords.longitude
                  };
              }
        );
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



