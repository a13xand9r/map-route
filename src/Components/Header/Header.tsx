import React from 'react'
import styles from './header.module.css'

export const Header: React.FC = () => {
    return(
        <header className = {styles.header}>
            <p className = {styles.header__title}>Постройте маршрут</p>
            <p className = {styles.header__text}>Введите имя точки и она появится в центре карты</p>
        </header>
    )
}