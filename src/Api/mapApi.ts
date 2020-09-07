import { YMapsApi } from "react-yandex-maps"

export const getAddressFromCoordinatesApi = async (yMaps: YMapsApi, coordinates: Array<number>) => {
    let result = await yMaps.geocode(coordinates)
    return result.geoObjects.get(0).getAddressLine()
}