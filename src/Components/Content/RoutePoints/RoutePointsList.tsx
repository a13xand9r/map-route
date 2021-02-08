import React, { Dispatch, memo, useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { NewPointFormMemo } from './NewPointForm/NewPointForm'
import { PointItem } from './PointItem'
import { RoutePointType, actions, ActionsType } from '../../../mapRouteReducer'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styles from './RoutePoints.module.css'
import './../../../index.css'

export const RoutePointsList: React.FC<PropsType> = memo(
    (props) => {
        const { dispatch, routeArray, isNoPointInCenter } = props
        const onDragEnd = useCallback(
            (result: DropResult) => {
                const { destination, reason, source } = result
                if (!destination || destination.index === source.index || reason === 'CANCEL') {
                    return
                }
                dispatch(actions.reorderRoutePoints(source.index, destination.index))
            }, [dispatch]
        )
        const requestNewPoint = useCallback(
            (newPointName: string) => {
                dispatch(actions.setPointIsFetching('NEW_POINT', newPointName))
            },[dispatch]
        )
        return (
            <>
                <NewPointFormMemo addNewPoint={requestNewPoint} isNoPointInCenter={isNoPointInCenter} />
                {routeArray.length === 0 && <p className={styles.noPointText}>Точек маршрута пока нет</p>}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='RouteList'>
                        {provided =>
                        (<div ref={provided.innerRef} {...provided.droppableProps}>
                            <TransitionGroup className="point-list">
                                {routeArray.map((point: RoutePointType, index: number) => (
                                    <CSSTransition 
                                        key={point.id.toString()}
                                        timeout={400}
                                        classNames='pointItem'
                                    >
                                        <PointItem {...point} index={index} dispatch={dispatch} />
                                    </CSSTransition>
                                ))}
                                {provided.placeholder}
                            </TransitionGroup>
                        </div>)}
                    </Droppable>
                </DragDropContext>
            </>
        )
    }
)

type PropsType = {
    dispatch: Dispatch<ActionsType>
    routeArray: Array<RoutePointType>
    isNoPointInCenter: boolean
}