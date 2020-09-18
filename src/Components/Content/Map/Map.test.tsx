import React from 'react'
import { create, act, ReactTestRenderer, ReactTestInstance } from 'react-test-renderer'
import { Map } from 'react-yandex-maps'
import { MapComponent } from './Map'

let routeArray = [
    { addr: 'Москва, Ленина 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
    { addr: 'Москва, Комсомольская 43к2', name: 'Mall', coordinates: [57.684758, 39.738521], id: 2 },
    { addr: 'Казань, Площадь Ильича 32a', name: 'Parking', coordinates: [56.684758, 39.738521], id: 3 },
]
describe('map component', () => {
    let mockDispatch = jest.fn()
    let component: ReactTestRenderer
    let componentRoot: ReactTestInstance
    beforeEach(() => {
        mockDispatch.mockClear()
        act(() => {
            component = create(<MapComponent dispatch={mockDispatch}
                routeArray={routeArray}
                mapState={{ center: [55.75, 37.57], zoom: 9 }}
            />)
        })
        componentRoot = component.root
    })

    test(`there is should be error input class if center coordinates wasn't updated`, () => {
        let map = componentRoot.findByType(Map)
        act(() => {
            map.props.onBoundsChange({ originalEvent: { newCenter: [55.77777, 37.77777], newZoom: 7 } })
        })
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_MAP_CENTER', payload: { center: [55.77777, 37.77777], zoom: 7 } })
    })
})