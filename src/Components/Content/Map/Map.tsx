import React, { Dispatch, useEffect, useState } from 'react'
import styles from './map.module.css'
import { YMaps, Map, Placemark, YMapsApi, Polyline } from 'react-yandex-maps'
import { ActionsType, actions, RoutePointType, PointIsFetchingType } from '../../../mapRouteReducer'
import { getAddressFromCoordinatesApi } from '../../../Api/mapApi'

const defaultState = { center: [55.75, 37.57], zoom: 9 }

export const MapComponent: React.FC<PropsType> = ({ dispatch, routeArray, pointIsFetching, yMaps }) => {
    const [coordinates, setCoordinates] = useState<Array<number>>()
    const [moveMarkerId, setId] = useState<number>()
    const onLoad = (yMaps: YMapsApi) => {
        dispatch(actions.setYMaps(yMaps))
    }
    const onBoundsChange = (e: any) => {
        dispatch(actions.updateCenterCoordinates(e.originalEvent.newCenter))
    }
    const onDragEnd = (id: number, event: any) => {
        let coordinates = event.get('target').geometry.getCoordinates()
        setCoordinates(coordinates)
        setId(id)
        dispatch(actions.pointIsFetching('UPDATE_COORDINATES'))
    }
    useEffect(() => {
        const updateCoordinates = async () => {
            if (yMaps && pointIsFetching === 'UPDATE_COORDINATES' && coordinates && moveMarkerId) {
                {
                    let addr: string = await getAddressFromCoordinatesApi(yMaps, coordinates)
                    dispatch(actions.updatePointCoordinates(coordinates, addr, moveMarkerId))
                    dispatch(actions.pointIsFetching(null))
                }
            } 
        }
        updateCoordinates()
    }, [pointIsFetching])
    return (
       // <div className={styles.map}>
            <YMaps query={{
                apikey: '85158385-1882-447a-a9fb-85b7dc0c94ff'
            }}>
                <Map className={styles.map} defaultState={defaultState}
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
                            //balloonCloseButton: false,
                            strokeColor: '#050',
                            strokeWidth: 2,
                            strokeOpacity: 0.5,
                        }} />
                </Map>
            </YMaps>
       // </div>
    )
}

type PropsType = {
    dispatch: Dispatch<ActionsType>
    routeArray: Array<RoutePointType>
    pointIsFetching: PointIsFetchingType
    yMaps: YMapsApi | null
}