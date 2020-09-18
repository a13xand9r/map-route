import { yandexMapsApi } from './mapApi';


const result = {
    geoObjects: {
        get: jest.fn()
    }
}
const YMapsApiMock = {
    geocode: jest.fn()
}
const getAddress = {
    getAddressLine: jest.fn()
}
YMapsApiMock.geocode.mockReturnValue(Promise.resolve(result))
result.geoObjects.get.mockReturnValue(getAddress)
getAddress.getAddressLine.mockReturnValue('Москва, Комсомольская 43к2')

it('yandex map API success test', async () => {
    let addr = await yandexMapsApi.getAddressFromCoordinates(YMapsApiMock, [55.55, 44.44])
    expect(addr).toBe('Москва, Комсомольская 43к2')
    expect(YMapsApiMock.geocode).toHaveBeenCalledWith([55.55, 44.44])
})

it('yandex map API error test', async () => {
    YMapsApiMock.geocode.mockRejectedValue(new Error('ERROR OCCURRED'))
    await expect(yandexMapsApi.getAddressFromCoordinates(YMapsApiMock, [55.55, 44.44])).rejects.toThrow('ERROR OCCURRED');
})