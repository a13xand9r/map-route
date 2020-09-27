import { yandexMapsApi } from './Api/mapApi'
import { StateType, RoutePointType, actions, mapRouteReducer, PointIsFetchingType, updatePointCoordinates, addNewPoint } from './mapRouteReducer'


let state: StateType
let routeArray: Array<RoutePointType>

beforeEach(() => {
    state = {
        routeArray: [
            { addr: 'Москва, Ленина 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
            { addr: 'Москва, Комсомольская 43к2', name: 'Mall', coordinates: [57.684758, 39.738521], id: 2 },
            { addr: 'Казань, Площадь Ильича 32a', name: 'Parking', coordinates: [56.684758, 39.738521], id: 3 },
        ],
        yandexMapState: { center: [55.75, 37.57], zoom: 9 },
        yMaps: null,
        pointIsFetching: {
            reason: null,
            newPointName: null,
            movedMarker: {
                id: null,
                newCoordinates: null
            }
        },
        isNoPointInCenter: true
    }
    routeArray = state.routeArray
})

describe('adding new point', () => {
    const newPointData: RoutePointType = { addr: 'Москва, Отрадное 32к1', name: 'Moscow church', coordinates: [55.75, 37.57], id: 4 }
    const action = actions.addRoutePoint('Moscow church', 'Москва, Отрадное 32к1')
    it('length of routeArray should increment', () => {
        expect(mapRouteReducer(state, action).routeArray.length).toBe(4)
    })
    it('data of new point should be correct', () => {
        expect(mapRouteReducer(state, action).routeArray[3]).toEqual(newPointData)
    })
    it(`other points shouldn't be changed`, () => {
        expect(mapRouteReducer(state, action).routeArray.filter((el, index) => index !== 3)).toEqual(routeArray)
    })
    it('noPointInCenter bool should be false', () => {
        expect(mapRouteReducer(state, action).isNoPointInCenter).toBeFalsy()
    })
})

describe('deleting point', () => {
    const action = actions.deleteRoutePoint(2)
    it('length of routeArray should decrement', () => {
        expect(mapRouteReducer(state, action).routeArray.length).toBe(2)
    })
    it(`other points shouldn't be changed`, () => {
        const routeArray = [
            { addr: 'Москва, Ленина 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
            { addr: 'Казань, Площадь Ильича 32a', name: 'Parking', coordinates: [56.684758, 39.738521], id: 3 }
        ]
        expect(mapRouteReducer(state, action).routeArray).toEqual(routeArray)
    })
})

describe('point is fetching', () => {
    it('new point fetching should be set', () => {
        const pointIsFetchingObject: PointIsFetchingType = {
            reason: 'NEW_POINT',
            newPointName: 'Big Ben',
            movedMarker: {
                id: null,
                newCoordinates: null
            }
        }
        const action = actions.setPointIsFetching('NEW_POINT', 'Big Ben')
        expect(mapRouteReducer(state, action).pointIsFetching).toEqual(pointIsFetchingObject)
    })
    it('update point coordinates fetching should be set', () => {
        const pointIsFetchingObject: PointIsFetchingType = {
            reason: 'UPDATE_COORDINATES',
            newPointName: null,
            movedMarker: {
                id: 2,
                newCoordinates: [35.777, 14.777]
            }
        }
        const action = actions.setPointIsFetching('UPDATE_COORDINATES', null, [35.777, 14.777], 2)
        expect(mapRouteReducer(state, action).pointIsFetching).toEqual(pointIsFetchingObject)
    })
    it('fetching after delete should be null', () => {
        const pointIsFetchingObject: PointIsFetchingType = {
            reason: null,
            newPointName: null,
            movedMarker: {
                id: null,
                newCoordinates: null
            }
        }
        const action = actions.setPointIsFetching(null)
        expect(mapRouteReducer(state, action).pointIsFetching).toEqual(pointIsFetchingObject)
    })
})

describe('updating point coordinates', () => {
    const newCoordinates: Array<number> = [55.755, 37.577]
    it('point coordinates should update', () => {
        const action = actions.updatePointCoordinates(newCoordinates, 'Москва, Отрадное 32к1', 3)
        expect(mapRouteReducer(state, action).routeArray.filter(el => el.id === 3)[0].coordinates).toEqual(newCoordinates)
    })
    it(`point coordinates shouldn't update if there is no point with action id`, () => {
        const action = actions.updatePointCoordinates(newCoordinates, 'Москва, Отрадное 32к1', 100)
        expect(mapRouteReducer(state, action).routeArray).toEqual(routeArray)
    })
    it(`noPointInCenter bool should be true if id is max`, () => {
        state.isNoPointInCenter = false
        const action = actions.updatePointCoordinates(newCoordinates, 'Москва, Отрадное 32к1', 3)
        expect(mapRouteReducer(state, action).isNoPointInCenter).toBeTruthy()
    })
    it(`noPointInCenter bool should be false if id is not max`, () => {
        state.isNoPointInCenter = false
        const action = actions.updatePointCoordinates(newCoordinates, 'Москва, Отрадное 32к1', 2)
        expect(mapRouteReducer(state, action).isNoPointInCenter).toBeFalsy()
    })
})

describe('change point order', () => {
    it('points should be reordered', () => {
        const routeArray = [
            { addr: 'Москва, Комсомольская 43к2', name: 'Mall', coordinates: [57.684758, 39.738521], id: 2 },
            { addr: 'Казань, Площадь Ильича 32a', name: 'Parking', coordinates: [56.684758, 39.738521], id: 3 },
            { addr: 'Москва, Ленина 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
        ]
        const action = actions.reorderRoutePoints(0, 2)
        expect(mapRouteReducer(state, action).routeArray).toEqual(routeArray)
    })
    it(`points shouldn't be reordered`, () => {
        const action = actions.reorderRoutePoints(1, 1)
        expect(mapRouteReducer(state, action).routeArray).toEqual(routeArray)
    })
})

describe('update map center', () => {
    const newCoordinates: Array<number> = [50, 40]
    const action = actions.updateCenter(newCoordinates, 10)
    it('center coordinates should update', () => {
        expect(mapRouteReducer(state, action).yandexMapState.center).toEqual(newCoordinates)
    })
    it('zoom should update', () => {
        expect(mapRouteReducer(state, action).yandexMapState.zoom).toBe(10)
    })
    it('noPointInCenter bool should be true', () => {
        state.isNoPointInCenter = false
        expect(mapRouteReducer(state, action).isNoPointInCenter).toBeTruthy()
    })
})

describe('set yMaps', () => {
    const YMaps = { yMaps: 'some value' }
    const action = actions.setYMaps(YMaps)
    it('yMaps object should be set', () => {
        expect(mapRouteReducer(state, action).yMaps).toBe(YMaps)
    })
})

//testing async functions

jest.mock('./Api/mapApi')
const yandexMapsApiMock = yandexMapsApi as jest.Mocked<typeof yandexMapsApi>
const newAddress = 'Самара, Минская 1а'
yandexMapsApiMock.getAddressFromCoordinates.mockReturnValue(Promise.resolve(newAddress))
describe('testing updatePointCoordinates function', () => {
    const newCoordinates = [55.55, 44.44]
    const mockDispatch = jest.fn()
    beforeEach(() => {
        mockDispatch.mockClear()
        yandexMapsApiMock.getAddressFromCoordinates.mockReturnValue(Promise.resolve(newAddress))
    })

    it('updatePointCoordinates success', async () => {
        const action = {
            type: 'UPDATE_POINT_COORDINATES',
            payload: { id: 2, coordinates: newCoordinates, addr: newAddress }
        }
        await updatePointCoordinates({}, newCoordinates, 2, mockDispatch, routeArray)
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, action)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, actions.setPointIsFetching(null))
    })

    it('updatePointCoordinates error', async () => {
        const action = {
            type: 'UPDATE_POINT_COORDINATES',
            payload: { id: 2, coordinates: [57.684758, 39.738521], addr: 'Москва, Комсомольская 43к2' }
        }
        yandexMapsApiMock.getAddressFromCoordinates.mockRejectedValue(new Error('ERROR OCCURRED'))
        await updatePointCoordinates({}, newCoordinates, 2, mockDispatch, routeArray)
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, action)
        expect(mockDispatch).toHaveBeenNthCalledWith(2, actions.setPointIsFetching(null))
    })
})

describe('testing addNewPoint function', () => {
    const mockDispatch = jest.fn()
    const newPointName = 'Big Ben'
    beforeEach(() => {
        mockDispatch.mockClear()
        yandexMapsApiMock.getAddressFromCoordinates.mockReturnValue(Promise.resolve(newAddress))
    })

    it('addNewPoint success', async () => {
        await addNewPoint({}, [55.55, 44.44], mockDispatch, newPointName)
        expect(mockDispatch).toBeCalledTimes(2)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, actions.addRoutePoint(newPointName, newAddress))
        expect(mockDispatch).toHaveBeenNthCalledWith(2, actions.setPointIsFetching(null))
    })

    it('addNewPoint error', async () => {
        yandexMapsApiMock.getAddressFromCoordinates.mockRejectedValue(new Error('ERROR OCCURRED'))
        await addNewPoint({}, [55.55, 44.44], mockDispatch, newPointName)
        expect(mockDispatch).toBeCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledWith(actions.setPointIsFetching(null))
    })
})