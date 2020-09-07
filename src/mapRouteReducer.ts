import { YMapsApi } from "react-yandex-maps"

export let initialState = {
    routeArray: [
        {addr: 'Moscow, Lenina 1', name: 'Vape shop', coordinates: [55.684758, 37.738521], id: 1},
        {addr: 'Moscow, Komsomolskaya 43k1', name: 'Tigr mall', coordinates: [57.684758, 39.738521], id: 2},
        {addr: 'Kazan, Ilicha 32a', name: 'Kazan church', coordinates: [56.684758, 39.738521], id: 3},
    ] as Array<RoutePointType>,
    centerCoordinates: [55.75, 37.57] as Array<number>,
    yMaps: null as null | YMapsApi,
    pointIsFetching: null as PointIsFetchingType,
    centerCoordinatesUpdated: true
}

export const mapRouteReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type){
        case 'ADD_POINT':
            let newId: number = 0
            state.routeArray.forEach(point => {
                if (newId < point.id) newId = point.id
            })
            return {
                ...state,
                routeArray: [...state.routeArray, {...action.payload, coordinates: state.centerCoordinates, id: newId + 1}],
                centerCoordinatesUpdated: false
            }
        case 'POINT_IS_FETCHING':
            return {
                ...state,
                pointIsFetching: action.reason
            }
        case 'DELETE_POINT':
            return {
                ...state,
                routeArray: state.routeArray.filter(point => point.id !== action.id)
            }
        case 'UPDATE_POINT_COORDINATES':
            return {
                ...state,
                routeArray: state.routeArray.map(point => {
                    if (action.id !== point.id) return point
                    else return {...point, ...action.payload}
                })
            }
        case 'MOVE_POINT': 
            let routePoints = [...state.routeArray]
            let droppedPoint = {...state.routeArray[action.sourceIndex]}
            routePoints.splice(action.sourceIndex, 1)
            routePoints.splice(action.destIndex, 0, droppedPoint)
            return {
                ...state,
                routeArray: routePoints
            }
        case 'UPDATE_CENTER_COORDINATES': 
            return {
                ...state,
                centerCoordinates: action.center,
                centerCoordinatesUpdated: true
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
    addRoutePoint: (name: string, addr: string) => ({type: 'ADD_POINT', payload: {name, addr}} as const),
    pointIsFetching: (reason: 'NEW_POINT' | 'UPDATE_COORDINATES' | null) => ({type: 'POINT_IS_FETCHING', reason} as const),
    deleteRoutePoint: (id: number) => ({type: 'DELETE_POINT', id} as const),
    moveRoutePoint: (sourceIndex: number, destIndex: number) => ({type: 'MOVE_POINT', sourceIndex, destIndex} as const),
    updateCenterCoordinates: (center: Array<number>) => ({type: 'UPDATE_CENTER_COORDINATES', center} as const),
    updatePointCoordinates: (coordinates: Array<number>, addr: string, id: number) => ({type: 'UPDATE_POINT_COORDINATES', id, payload: {coordinates, addr}} as const),
    setYMaps: (yMaps: YMapsApi) => ({type: 'SET_YMAPS', yMaps} as const)
}

type InferActionType<T> = T extends {[key: string]: (...args: any[]) => infer U} ? U : never
export type ActionsType = InferActionType<typeof actions>
export type RoutePointType = {
    addr: string
    name: string
    coordinates: Array<number>
    id: number
}
export type PointIsFetchingType = 'NEW_POINT' | 'UPDATE_COORDINATES' | null
export type InitialStateType = typeof initialState