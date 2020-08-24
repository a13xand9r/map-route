

export let initialState = {
    routeArray: [
        {addr: 'Moscow, Lenina 1', name: 'Vape shop', id: 1},
        {addr: 'Moscow, Komsomolskaya 43k1', name: 'Tigr mall', id: 2},
        {addr: 'Kazan, Ilicha 32a', name: 'Kazan church', id: 3},
    ] as Array<RoutePointType>
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
                routeArray: [...state.routeArray, {name: action.name, addr: action.addr, id: newId + 1}]
            }
        case 'DELETE_POINT':
            return {
                ...state,
                routeArray: state.routeArray.filter(point => point.id !== action.id)
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
        default: return state
    }
}

export const actions = {
    addRoutePoint: (name: string, addr: string) => ({type: 'ADD_POINT', name, addr} as const),
    deleteRoutePoint: (id: number) => ({type: 'DELETE_POINT', id} as const),
    moveRoutePoint: (sourceIndex: number, destIndex: number) => ({type: 'MOVE_POINT', sourceIndex, destIndex} as const)
}

type InferActionType<T> = T extends {[key: string]: (...args: any[]) => infer U} ? U : never
export type ActionsType = InferActionType<typeof actions>
export type RoutePointType = {
    addr: string
    name: string
    id: number
}
export type InitialStateType = typeof initialState