import React, { useEffect, Dispatch, useState } from 'react'
import styles from './routePoints.module.css'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { NewPointForm } from './NewPointForm/NewPointForm'
import { PointItem } from './PointItem'
import { RoutePointType, actions, ActionsType, PointIsFetchingType } from '../../../mapRouteReducer'
import { YMapsApi } from 'react-yandex-maps'
import { getAddressFromCoordinatesApi } from '../../../Api/mapApi'

export const RoutePoints: React.FC<PropsType> = ({dispatch, routeArray, yMaps, centerCoordinates, pointIsFetching, centerCoordinatesUpdated}) => {
    let [pointName, setPointName] = useState<string>()
    const onDragEnd = (result: DropResult) => {
        let { destination, reason, source } = result
        if (!destination || destination.index === source.index || reason === 'CANCEL') {
            return;
        }
        dispatch(actions.moveRoutePoint(source.index, destination.index))
    }
    const addNewPoint = (newPointName: string) => {
        setPointName(newPointName)
        dispatch(actions.pointIsFetching('NEW_POINT'))
    }
    useEffect(() => {
        const addNewPoint = async () => {
            if (yMaps && pointIsFetching === 'NEW_POINT' && centerCoordinates && pointName) {
                {
                    let addr: string = await getAddressFromCoordinatesApi(yMaps, centerCoordinates)
                    dispatch(actions.addRoutePoint(pointName, addr))
                    dispatch(actions.pointIsFetching(null))
                }
            } 
        }
        addNewPoint()
    }, [pointIsFetching])
    return (
        <div>
            <NewPointForm addNewPoint={addNewPoint} centerCoordinatesUpdated={centerCoordinatesUpdated}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="RouteList">
                    {provided =>
                        (<div ref={provided.innerRef} {...provided.droppableProps}>
                            {routeArray.map((point: RoutePointType, index: number) => (
                                <PointItem key={point.id} {...point} index = {index} dispatch={dispatch} />))}
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
    yMaps: YMapsApi | null
    centerCoordinates: Array<number> | null
    pointIsFetching: PointIsFetchingType
    centerCoordinatesUpdated: boolean
}