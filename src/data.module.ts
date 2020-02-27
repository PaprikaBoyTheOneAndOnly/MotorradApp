import * as LocationService from './service/LocationService';

export enum Task {
    TRACK_ROUTE = 'TrackRoute',
}

export enum StorageKey {
    TRACK_ROUTE_ERROR = 'TrackRouteErrors',
    CURRENT_ROUTE_COORDS = 'CurrentRouteCoords',
    CURRENT_ROUTE = 'CurrentRoute',
}

export interface ICoordinate {
    latitude: number;
    longitude: number;
}

export interface IRoute {
    name: string;
    origin: ICoordinate;
    destination: ICoordinate;
    polylineCoordinates: ICoordinate[];
}

export class Route implements IRoute {
    name: string;
    origin: ICoordinate;
    destination: ICoordinate;
    polylineCoordinates: ICoordinate[];

    constructor(name: string,
                origin: ICoordinate,
                destination?: ICoordinate,
                polylineCoordinates?: ICoordinate[]) {
        this.name = name;
        this.destination = destination;
        this.polylineCoordinates = polylineCoordinates ? polylineCoordinates : [];
        this.origin = origin;
    }
}

export const stackConfig = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            height: 70,
        },
        headerTintColor: 'white',
    },
};

export const globalStyles = {
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.0)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        backgroundColor: 'white',
        paddingLeft: 5,
        height: 30,
    },
};
