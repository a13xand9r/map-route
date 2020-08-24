import React from 'react'
import styles from './MapRouting.module.css'
import { RoutePoints } from './RoutePoints/RoutePoints'
import { Map } from './Map/Map'


export const MapRouting: React.FC = (props) => {
    return (
        <main className={styles.mapRouting}>
            <div className = {styles.mapRouting__wrapper}>
                <RoutePoints />
                <Map />
            </div>
        </main>
    )
}