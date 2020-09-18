import React from 'react'
import { create, act, ReactTestRenderer, ReactTestInstance } from 'react-test-renderer'
import { RoutePointsList } from './RoutePointsList'
import { DragDropContext } from 'react-beautiful-dnd'
import { NewPointForm } from './NewPointForm/NewPointForm'
import { PointItem } from './PointItem'

let routeArray = [
    { addr: 'Москва, Ленина 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
    { addr: 'Москва, Комсомольская 43к2', name: 'Mall', coordinates: [57.684758, 39.738521], id: 2 },
    { addr: 'Казань, Площадь Ильича 32a', name: 'Parking', coordinates: [56.684758, 39.738521], id: 3 },
]
let mockDispatch = jest.fn()
let component: ReactTestRenderer
let componentRoot: ReactTestInstance
beforeEach(() => {
    mockDispatch.mockClear()
    act(() => {
        component = create(<RoutePointsList dispatch={mockDispatch}
            routeArray={routeArray}
            noPointInCenter={true}
        />)
    })
    componentRoot = component.root
})

describe('route points list component', () => {
    test(`dispatch should be called after onDragEnd`, () => {
        let action = { destIndex: 2, sourceIndex: 0, type: 'CHANGE_POINTS_ORDER' }
        let dragDrop = componentRoot.findByType(DragDropContext)
        act(() => dragDrop.props.onDragEnd({ destination: { index: 2 }, reason: 'DROP', source: { index: 0 } }))
        expect(mockDispatch).toHaveBeenCalledWith(action)
        expect(mockDispatch).toHaveBeenCalledTimes(1)
    })

    test(`dispatch shouldn't be called after onDragEnd if destination == source or drop reason is CANCEL`, () => {
        let dragDrop = componentRoot.findByType(DragDropContext)
        act(() => dragDrop.props.onDragEnd({ destination: { index: 1 }, reason: 'DROP', source: { index: 1 } }))
        act(() => dragDrop.props.onDragEnd({ destination: { index: 2 }, reason: 'CANCEL', source: { index: 1 } }))
        expect(mockDispatch).toHaveBeenCalledTimes(0)
    })

    test(`dispatch should be called after adding a new point`, () => {
        let action = {
            type: 'SET_POINT_IS_FETCHING',
            payload: {
                reason: 'NEW_POINT',
                newPointName: 'Big Ben',
                newCoordinates: null,
                movedMarkerId: null
            }
        }
        let newPointForm = componentRoot.findByType(NewPointForm)
        act(() => newPointForm.props.addNewPoint('Big Ben'))
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledWith(action)
    })

    test(`dispatch for point deleting should be called`, () => {
        let action = { type: 'DELETE_POINT', id: 1 }
        let pointItem = componentRoot.findAllByType(PointItem)[0]
        let deleteButton = pointItem.findByType('span')
        act(() => { deleteButton.props.onClick() })
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toBeCalledWith(action)
    })
})