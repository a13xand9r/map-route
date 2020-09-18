import { YMapsApi } from "react-yandex-maps"
import { Dispatch } from "react"
import { yandexMapsApi } from "./Api/mapApi"

export let initialState = {
    routeArray: [
        { addr: 'Moscow, Lenina 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1 },
        { addr: 'Moscow, Komsomolskaya 43k1', name: 'Tigr mall', coordinates: [57.684758, 39.738521], id: 2 },
        { addr: 'Kazan, Ilicha 32a', name: 'Kazan church', coordinates: [56.684758, 39.738521], id: 3 },
    ] as Array<RoutePointType>,
    yandexMapState: { center: [55.75, 37.57], zoom: 9 } as yandexMapStateType,
    yMaps: null as null | YMapsApi,
    pointIsFetching: {
        reason: null,
        newPointName: null,
        movedMarker: {
            id: null,
            newCoordinates: null
        }
    } as PointIsFetchingType,
    noPointInCenter: true
}

export const mapRouteReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'ADD_POINT':
            let newId: number = 0
            state.routeArray.forEach(point => {
                if (newId < point.id) newId = point.id
            })
            return {
                ...state,
                routeArray: [...state.routeArray, { ...action.payload, coordinates: state.yandexMapState.center, id: newId + 1 }],
                noPointInCenter: false
            }
        case 'DELETE_POINT':
            return {
                ...state,
                routeArray: state.routeArray.filter(point => point.id !== action.id)
            }
        case 'SET_POINT_IS_FETCHING':
            return {
                ...state,
                pointIsFetching: {
                    reason: action.payload.reason,
                    newPointName: action.payload.newPointName,
                    movedMarker: {
                        id: action.payload.movedMarkerId,
                        newCoordinates: action.payload.newCoordinates
                    }
                }
            }
        case 'UPDATE_POINT_COORDINATES':
            let maxId: number = -1
            if (!state.noPointInCenter)
                maxId = Math.max.apply(null, state.routeArray.map(point => point.id))
            return {
                ...state,
                noPointInCenter: maxId === action.payload.id ? true : state.noPointInCenter,
                routeArray: state.routeArray.map(point => {
                    if (action.payload.id !== point.id) return point
                    else return { ...point, ...action.payload, coordinates: [...action.payload.coordinates] }
                })
            }
        case 'CHANGE_POINTS_ORDER':
            let routePoints = [...state.routeArray]
            let droppedPoint = { ...state.routeArray[action.sourceIndex] }
            routePoints.splice(action.sourceIndex, 1)
            routePoints.splice(action.destIndex, 0, droppedPoint)
            return {
                ...state,
                routeArray: routePoints
            }
        case 'UPDATE_MAP_CENTER':
            return {
                ...state,
                yandexMapState: action.payload,
                noPointInCenter: true
            }
        case 'SET_YMAPS':
            return {
                ...state,
                yMaps: action.yMaps
            }
        default: return state
    }
}

export const actions = {
    addRoutePoint: (name: string, addr: string) => ({ type: 'ADD_POINT', payload: { name, addr } } as const),
    setPointIsFetching: (reason: PointIsFetchingReasonType,
        newPointName: string | null = null,
        newCoordinates: Array<number> | null = null,
        movedMarkerId: number | null = null) => (
            { type: 'SET_POINT_IS_FETCHING', payload: { reason, newPointName, newCoordinates, movedMarkerId } } as const
        ),
    deleteRoutePoint: (id: number) => ({ type: 'DELETE_POINT', id } as const),
    reorderRoutePoints: (sourceIndex: number, destIndex: number) => ({ type: 'CHANGE_POINTS_ORDER', sourceIndex, destIndex } as const),
    updateCenter: (center: Array<number>, zoom: number) => ({ type: 'UPDATE_MAP_CENTER', payload: { center, zoom } } as const),
    updatePointCoordinates: (coordinates: Array<number>, addr: string, id: number) => (
        { type: 'UPDATE_POINT_COORDINATES', payload: { id, coordinates, addr } } as const
    ),
    setYMaps: (yMaps: YMapsApi) => ({ type: 'SET_YMAPS', yMaps } as const)
}

export const updatePointCoordinates = async (yMaps: YMapsApi,
    coordinates: Array<number>,
    moveMarkerId: number,
    dispatch: Dispatch<ActionsType>,
    routeArray: Array<RoutePointType>) => {
    try {
        let addr: string = await yandexMapsApi.getAddressFromCoordinates(yMaps, coordinates)
        dispatch(actions.updatePointCoordinates(coordinates, addr, moveMarkerId))
    } catch {
        let routePointToReturnBack = routeArray.filter(point => moveMarkerId === point.id)[0]
        let coordinatesBack = routePointToReturnBack.coordinates
        let addrBack = routePointToReturnBack.addr
        dispatch(actions.updatePointCoordinates(coordinatesBack, addrBack, moveMarkerId))
    }
    dispatch(actions.setPointIsFetching(null))
}

export const addNewPoint = async (yMaps: YMapsApi,
    coordinates: Array<number>,
    dispatch: Dispatch<ActionsType>,
    pointName: string) => {
    try {
        let addr: string = await yandexMapsApi.getAddressFromCoordinates(yMaps, coordinates)
        dispatch(actions.addRoutePoint(pointName, addr))
    } catch { }
    dispatch(actions.setPointIsFetching(null))
}

type InferActionType<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never
export type ActionsType = InferActionType<typeof actions>
export type RoutePointType = {
    addr: string
    name: string
    coordinates: Array<number>
    id: number
}
export type yandexMapStateType = {
    center: Array<number>,
    zoom: number
}
export type PointIsFetchingReasonType = 'NEW_POINT' | 'UPDATE_COORDINATES' | null
export type PointIsFetchingType = {
    reason: PointIsFetchingReasonType
    newPointName: string | null
    movedMarker: {
        id: number | null
        newCoordinates: Array<number> | null
    }
}
export type InitialStateType = typeof initialState