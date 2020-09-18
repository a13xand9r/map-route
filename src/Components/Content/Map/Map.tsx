import React, { Dispatch } from 'react'
import styles from './map.module.css'
import { YMaps, Map, Placemark, YMapsApi, Polyline, AnyObject } from 'react-yandex-maps'
import { ActionsType, actions, RoutePointType, yandexMapStateType } from '../../../mapRouteReducer'

export const MapComponent: React.FC<PropsType> = ({ dispatch, routeArray, mapState }) => {

    const onLoad = (yMaps: YMapsApi) => {
        dispatch(actions.setYMaps(yMaps))
    }
    const onBoundsChange = (event: BoundChangeEventType) => {
        dispatch(actions.updateCenter(event.originalEvent.newCenter, event.originalEvent.newZoom))
    }
    const onDragEnd = (id: number, event: AnyObject) => {
        let coordinates = event.get('target').geometry.getCoordinates()
        dispatch(actions.setPointIsFetching('UPDATE_COORDINATES', null, coordinates, id))
    }
    return (
        <YMaps query={{
            apikey: '85158385-1882-447a-a9fb-85b7dc0c94ff'
        }}>
            <Map className={styles.map} state={mapState}
                modules={['geocode']}
                onBoundsChange={onBoundsChange}
                onLoad={onLoad}>
                {routeArray.map(point => <Placemark geometry={point.coordinates}
                    modules={['geoObject.addon.balloon']}
                    options={{ draggable: true }}
                    onDragEnd={onDragEnd.bind(null, point.id)}
                    properties={{ balloonContent: point.name }}
                    key={point.id.toString()} />)}
                <Polyline
                    geometry={routeArray.map(point => point.coordinates)}
                    options={{
                        strokeColor: '#050',
                        strokeWidth: 2,
                        strokeOpacity: 0.5,
                    }} />
            </Map>
        </YMaps>
    )
}

type PropsType = {
    dispatch: Dispatch<ActionsType>
    routeArray: Array<RoutePointType>
    mapState: yandexMapStateType
}
type BoundChangeEventType = {
    originalEvent: {
        newCenter: Array<number>
        oldCenter: Array<number>
        newZoom: number
        oldZoom: number
    }
}