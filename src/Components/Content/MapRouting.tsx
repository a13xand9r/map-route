import React, { useEffect, useReducer } from 'react'
import styles from './MapRouting.module.css'
import { RoutePointsList } from './RoutePoints/RoutePointsList'
import { MapComponent } from './Map/Map'
import { mapRouteReducer, initialState, updatePointCoordinates, addNewPoint } from '../../mapRouteReducer'


export const MapRouting: React.FC = () => {
    const [state, dispatch] = useReducer(mapRouteReducer, initialState)
    const { pointIsFetching, routeArray, yMaps, yandexMapState } = state
    useEffect(() => {
        const { reason, newPointName, movedMarker } = pointIsFetching
        if (reason === 'NEW_POINT' && yMaps && newPointName) {
            addNewPoint(yMaps, yandexMapState.center, dispatch, newPointName)
        } else if (reason === 'UPDATE_COORDINATES' && yMaps && movedMarker.newCoordinates && movedMarker.id) {
            updatePointCoordinates(yMaps, movedMarker.newCoordinates, movedMarker.id, dispatch, routeArray)
        }
    }, [pointIsFetching])
    return (
        <main className={styles.mapRouting}>
            <div className={styles.mapRouting__points}>
                <RoutePointsList dispatch={dispatch}
                    routeArray={state.routeArray}
                    isNoPointInCenter={state.isNoPointInCenter} />
            </div>
            <div className={styles.mapRouting__map}>
                <MapComponent dispatch={dispatch}
                    routeArray={state.routeArray}
                    mapState={state.yandexMapState} />
            </div>
        </main>
    )
}