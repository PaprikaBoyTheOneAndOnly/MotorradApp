import HamburgerMenu from './component/HamburgerMenu';
import React from 'react';

export enum Task {
    TRACK_ROUTE = 'TrackRoute',
}

export enum StorageKey {
    TRACK_ROUTE_ERROR = 'TrackRouteErrors',
    CURRENT_ROUTE_COORDS = 'CurrentRouteCoords',
}

export interface ICoordinate {
    latitude: number;
    longitude: number;
}

export interface IRoute {
    name: string;
    origin: ICoordinate;
    destination: ICoordinate;
    distance: number;
    polylineCoordinates: ICoordinate[];
}

export interface IRouteKey {
    [key: string]: IRoute;
}


export class Route implements IRoute {
    name: string;
    origin: ICoordinate;
    destination: ICoordinate;
    polylineCoordinates: ICoordinate[];
    distance: number;

    constructor(name: string,
                origin: ICoordinate,
                destination?: ICoordinate,
                polylineCoordinates?: ICoordinate[],
                distance?: number) {
        this.name = name;
        this.destination = destination;
        this.polylineCoordinates = polylineCoordinates ? polylineCoordinates : [];
        this.origin = origin;
        this.distance = distance;
    }

    calculateDistance() {
        if (this.polylineCoordinates.length === 0) {
            this.distance = this.distanceBetweenCoordinates(
                this.origin.latitude,
                this.origin.longitude,
                this.destination.latitude,
                this.destination.longitude);
        } else {
            let distance = this.distanceBetweenCoordinates(
                this.origin.latitude,
                this.origin.longitude,
                this.polylineCoordinates[0].latitude,
                this.polylineCoordinates[0].longitude);

            for (let i = 0; i < this.polylineCoordinates.length - 1; i++) {
                distance += this.distanceBetweenCoordinates(
                    this.polylineCoordinates[i].latitude,
                    this.polylineCoordinates[i].longitude,
                    this.polylineCoordinates[i + 1].latitude,
                    this.polylineCoordinates[i + 1].longitude);
            }

            let length = this.polylineCoordinates.length - 1;
            distance += this.distanceBetweenCoordinates(
                this.polylineCoordinates[length].latitude,
                this.polylineCoordinates[length].longitude,
                this.destination.latitude,
                this.destination.longitude);

            this.distance = distance;
        }
    }

    private distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            const p = 0.017453292519943295;
            const c = Math.cos;
            const a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;

            return 12742 * Math.asin(Math.sqrt(a));
        }
    }
}

export const staticNavigationOptions = (navigation) => {
    return {
        ...stackConfig,
        headerLeft: () => <HamburgerMenu navigation={navigation}/>
    }
};

export const stackConfig = {
    defaultNavigationOptions: {
        gestureEnabled: false,
        headerStyle: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            height: 70,
        },
        headerTintColor: 'white',
    },
};

export const
    globalStyles = {
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.0)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        errorText: {
            color: 'red',
            fontSize: 12,
        },
        errorBox: {
            height: 20,
            alignContent: 'center',
            justifyContent: 'center',
        },
        input: {
            width: '80%',
            backgroundColor: 'white',
            paddingLeft: 5,
            height: 30,
        },
    };
