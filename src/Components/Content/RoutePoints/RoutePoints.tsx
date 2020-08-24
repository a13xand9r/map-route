import React, { useReducer } from 'react'
import styles from './RoutePoints.module.css'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { NewPointForm } from './NewPointForm'
import { PointItem } from './PointItem'
import { mapRouteReducer, initialState, RoutePointType, actions } from '../../../mapRouteReducer'

export const RoutePoints = () => {
    let [state, dispatch] = useReducer(mapRouteReducer, initialState)
    const onDragEnd = (result: DropResult) => {
        let { destination, reason, source } = result
        if (!destination || destination.index === source.index || reason === 'CANCEL') {
            return;
        }

        dispatch(actions.moveRoutePoint(source.index, destination.index))
    }
    return (
        <div>
            <NewPointForm />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="RouteList">
                    {provided =>
                        (<div ref={provided.innerRef} {...provided.droppableProps}>
                            {state.routeArray.map((point: RoutePointType, index: number) => (
                                <PointItem key={point.id} {...point} index = {index} dispatch={dispatch} />))}
                            {provided.placeholder}
                        </div>)}
                </Droppable>
            </DragDropContext>
        </div>
    )
}