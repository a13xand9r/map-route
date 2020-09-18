import React, { useEffect, useReducer } from 'react'
import styles from './mapRouting.module.css'
import { RoutePointsList } from './RoutePoints/RoutePointsList'
import { MapComponent } from './Map/Map'
import { mapRouteReducer, initialState, updatePointCoordinates, addNewPoint } from '../../mapRouteReducer'


export const MapRouting: React.FC = () => {
    let [state, dispatch] = useReducer(mapRouteReducer, initialState)
    let { pointIsFetching, routeArray, yMaps, yandexMapState } = state
    useEffect(() => {
        let { reason, newPointName, movedMarker } = pointIsFetching
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
                    noPointInCenter={state.noPointInCenter} />
            </div>
            <div className={styles.mapRouting__map}>
                <MapComponent dispatch={dispatch}
                    routeArray={state.routeArray}
                    mapState={state.yandexMapState} />
            </div>
        </main>
    )
}