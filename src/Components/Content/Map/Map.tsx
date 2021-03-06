import React, { Dispatch, memo, useCallback } from 'react'
import styles from './Map.module.css'
import { YMaps, Map, Placemark, YMapsApi, Polyline, AnyObject } from 'react-yandex-maps'
import { ActionsType, actions, RoutePointType, yandexMapStateType } from '../../../mapRouteReducer'

export const MapComponent: React.FC<PropsType> = memo(
    ({ dispatch, routeArray, mapState }) => {

        const onLoad = useCallback(
            (yMaps: YMapsApi) => {
                dispatch(actions.setYMaps(yMaps))
            }, [dispatch]
        )
        const onBoundsChange = useCallback(
            (event: BoundChangeEventType) => {
                dispatch(actions.updateCenter(event.originalEvent.newCenter, event.originalEvent.newZoom))
            }, [dispatch]
        )
        const onDragEnd = useCallback (
            (id: number, event: AnyObject) => {
                const coordinates = event.get('target').geometry.getCoordinates()
                dispatch(actions.setPointIsFetching('UPDATE_COORDINATES', null, coordinates, id))
            }, [dispatch]
        )
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
                        key={point.id.toString()}
                        id={point.id.toString()}
                        placemarkTestId='placemark' />)}
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
)

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