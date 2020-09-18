import { YMapsApi } from 'react-yandex-maps'

export const GET_ADDRESS_ERROR_MESSAGE = 'Не выходит получить адрес точки, попробуйте позже'

export const yandexMapsApi = {
    getAddressFromCoordinates: async (yMaps: YMapsApi, coordinates: Array<number>) => {
        try {
            let result = await yMaps.geocode(coordinates)
            return result.geoObjects.get(0).getAddressLine()
        } catch (err) {
            alert(GET_ADDRESS_ERROR_MESSAGE)
            throw new Error(err)
        }
    }
}