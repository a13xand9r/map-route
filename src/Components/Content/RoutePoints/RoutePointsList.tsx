import React, { Dispatch } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { NewPointForm } from './NewPointForm/NewPointForm'
import { PointItem } from './PointItem'
import { RoutePointType, actions, ActionsType } from '../../../mapRouteReducer'

export const RoutePointsList: React.FC<PropsType> = (props) => {
    const { dispatch, routeArray, isNoPointInCenter: noPointInCenter } = props
    const onDragEnd = (result: DropResult) => {
        const { destination, reason, source } = result
        if (!destination || destination.index === source.index || reason === 'CANCEL') {
            return;
        }
        dispatch(actions.reorderRoutePoints(source.index, destination.index))
    }
    const requestNewPoint = (newPointName: string) => {
        dispatch(actions.setPointIsFetching('NEW_POINT', newPointName))
    }
    return (
        <div>
            <NewPointForm addNewPoint={requestNewPoint} isNoPointInCenter={noPointInCenter} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='RouteList'>
                    {provided =>
                        (<div ref={provided.innerRef} {...provided.droppableProps}>
                            {routeArray.map((point: RoutePointType, index: number) => (
                                <PointItem key={point.id.toString()} {...point} index={index} dispatch={dispatch} />))}
                            {provided.placeholder}
                        </div>)}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

type PropsType = {
    dispatch: Dispatch<ActionsType>
    routeArray: Array<RoutePointType>
    isNoPointInCenter: boolean
}