import React, { Dispatch, useState } from 'react'
import styles from './routePoints.module.css'
import { ActionsType, actions } from '../../../mapRouteReducer'
import { Draggable } from 'react-beautiful-dnd'
import handleIcon from '../../../img/dragHandleIcon.png'

export const PointItem: React.FC<PropsType> = ({name, addr, id, index, dispatch}) => {
    //let [dragHandle, setDragHandle] = useState(false)
    const onDeletePoint = () => {
        dispatch(actions.deleteRoutePoint(id))
    }
    return (
        <Draggable draggableId={id.toString()} index={index}>
            {provided => (
                <div className = {styles.routeItem} 
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                    // onMouseOver = {() => setDragHandle(true)}
                    // onMouseLeave = {() => setDragHandle(false)}
                    >
                    <img {...provided.dragHandleProps} src={handleIcon} alt='' className ={styles.routeItem__handle}/>
                        {/* className = {`${styles.routeItem__handle} ${dragHandle ? styles.routeItem__handleHover : ''}`}/> */}
                    <div className = {styles.routeItem__text}>
                        <p className = {styles.routeItem__name}>{name}</p>
                        <p className = {styles.routeItem__address}>{addr}</p>
                    </div>
                    <span onClick={onDeletePoint} className={styles.routeItem__delete}></span>
                </div>
            )}
        </Draggable>
    )
}

type PropsType = {
    id: number
    addr: string | null
    name: string
    index: number
    dispatch: Dispatch<ActionsType>
}