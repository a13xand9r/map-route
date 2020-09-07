import React, { useReducer } from 'react'
import styles from './mapRouting.module.css'
import { RoutePoints } from './RoutePoints/RoutePoints'
import { MapComponent } from './Map/Map'
import { mapRouteReducer, initialState } from '../../mapRouteReducer'


export const MapRouting: React.FC = () => {
    let [state, dispatch] = useReducer(mapRouteReducer, initialState)
    return (
        <main className={styles.mapRouting}>
            <div className={styles.mapRouting__points}>
                <RoutePoints dispatch={dispatch}
                    routeArray={state.routeArray}
                    yMaps={state.yMaps}
                    centerCoordinates={state.centerCoordinates}
                    pointIsFetching={state.pointIsFetching}
                    centerCoordinatesUpdated={state.centerCoordinatesUpdated} />
            </div>
            <div className={styles.mapRouting__map}>
                <MapComponent dispatch={dispatch}
                    routeArray={state.routeArray}
                    pointIsFetching={state.pointIsFetching}
                    yMaps={state.yMaps} />
            </div>
        </main>
    )
}