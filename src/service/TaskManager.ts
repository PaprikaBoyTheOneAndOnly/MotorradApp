import * as TaskManager from 'expo-task-manager';
import { ICoordinate, StorageKey, Task } from '../data.module';
import { AsyncStorage } from 'react-native';
import { LocationData } from 'expo-location';
import moment from 'moment';

export function defineTrackTask() {
    TaskManager.defineTask(Task.TRACK_ROUTE, (value) => {
        const {data, error} = value;

        if (error) {
            const err = {};
            err[moment().format('dd.mm.yyy hh:MM:ss')] = error;
            AsyncStorage.mergeItem(StorageKey.TRACK_ROUTE_ERROR, JSON.stringify(err)).then();
            return;
        } else {
            // @ts-ignore
            const locations: LocationData[] = data.locations;
            AsyncStorage.getItem(StorageKey.CURRENT_ROUTE_COORDS)
                .then((value: string) => {
                    let coords;
                    if (value !== null) {
                        coords = JSON.parse(value);
                        locations.forEach(location => {
                            const newCoords: ICoordinate = {
                                longitude: location.coords.longitude,
                                latitude: location.coords.latitude,
                            };
                            coords.push(newCoords);
                        });
                    } else {
                        coords = locations.map(location => {
                            const newCoords: ICoordinate = {
                                longitude: location.coords.longitude,
                                latitude: location.coords.latitude,
                            };
                            return newCoords;
                        });
                    }
                    AsyncStorage.setItem(StorageKey.CURRENT_ROUTE_COORDS, JSON.stringify(coords)).then();
                });
        }
    });
}
