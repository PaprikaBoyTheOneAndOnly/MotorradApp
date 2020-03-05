import {ICoordinate} from '../data.module';
import axios from 'axios';
import {Platform} from 'react-native';

//This class is unused yet, just keep it in order i need it later
export function getPolylineRoute(from: ICoordinate, to: ICoordinate, wayPoints: ICoordinate[]): Promise<ICoordinate[]> {
    const platform = Platform.OS;
    // This API provides a big amount of currently unused information like way descriptions for all sections, but i have planed to use them in the future.
    const key = `https://route.api.here.com/routing/7.2/calculateroute.json?` +
        `app_id=${platform === 'ios' ? '1dxvlFva2i8uj0kLhwSJ' : 'wvfjGSQl6irQLXrHAwFG'}` +
        `&app_code=${platform === 'ios' ? 'Ssnh_OQV93fYDFZZDPoMxg' : 'Ei5QzWa2cv-YAcpKFeUapg'}` +
        `&waypoint0=geo!${from.latitude},${from.longitude}` +
        `${wayPoints.map((coordinate, index) =>
                             `&waypoint${index + 1}=passThrough!${coordinate.latitude},${coordinate.longitude}`).join('')}` +
        `&waypoint${wayPoints.length + 1}=geo!${to.latitude + 4},${to.longitude + 4}` +
        //TODO add optimize route for traffic to settings
        `&mode=balanced;car;traffic:${'disabled'}` +
        `&legAttributes=shape`;
    return axios.get(key)
        .then(res => {
            return res.data.response.route[0].leg[0].shape.map(m => {
                let latlong = m.split(',');
                return {
                    latitude: parseFloat(latlong[0]),
                    longitude: parseFloat(latlong[1])
                };
            });
        }).catch(err => console.log('error', err));
}
