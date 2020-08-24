import React, { Dispatch } from 'react'
import styles from './RoutePoints.module.css'
import { ActionsType } from '../../../mapRouteReducer'
import { Draggable } from 'react-beautiful-dnd'

export const PointItem: React.FC<PropsType> = ({name, addr, id, index, dispatch}) => {
    return (
        <Draggable draggableId={id.toString()} index={index}>
            {provided => (
                <div className = {styles.routeItem} 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <p className = {styles.routeItem__address}>{addr}</p>
                    <p className = {styles.routeItem__name}>{name}</p>
                    <br />
                </div>
            )}
        </Draggable>
    )
}

type PropsType = {
    id: number
    addr: string
    name: string
    index: number
    dispatch: Dispatch<ActionsType>
}