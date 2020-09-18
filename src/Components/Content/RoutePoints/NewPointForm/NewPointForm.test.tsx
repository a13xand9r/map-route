import React from 'react'
import { create, act, ReactTestRenderer, ReactTestInstance } from 'react-test-renderer'
import { NewPointForm } from './NewPointForm'

let eventObject = { target: { name: 'newPoint', value: 'abc' } }
let mockCallback = jest.fn()
let component: ReactTestRenderer
let componentRoot: ReactTestInstance
let input: ReactTestInstance

describe('rendering new point form component with error input', () => {
    beforeEach(() => {
        mockCallback.mockClear()
        act(() => {
            component = create(<NewPointForm addNewPoint={mockCallback} noPointInCenter={false} />)
        })
        componentRoot = component.root
        input = componentRoot.findByType('input')
        act(() => {
            input.props.onChange(eventObject)
        })
    })


    test(`there is should be error input class if center coordinates wasn't updated`, () => {
        expect(input.props.className).toBe('newPointForm__input newPointForm__input_error')
    })
    test(`there is should be error <div> message if center coordinates wasn't updated`, () => {
        let div = componentRoot.findByProps({ className: 'newPointForm__errorText' })
        expect(div).not.toBeNull()
    })
    test(`component shouldn't call callback if noPointInCenter is false`, () => {
        act(() => {
            componentRoot.findByType('form').props.onSubmit({ preventDefault: () => { } })
        })
        expect(mockCallback).toHaveBeenCalledTimes(0)
    })
    test(`component shouldn't call callback if input value is empty`, () => {
        const mockCallback = jest.fn()
        let eventObject = { target: { name: 'newPoint', value: '' } }
        act(() => {
            component = create(<NewPointForm addNewPoint={mockCallback} noPointInCenter={true} />)
        })
        // @ts-ignore
        let rootComponent = component.root
        let input = componentRoot.findByType('input')
        act(() => { input.props.onChange(eventObject) })
        act(() => {
            componentRoot.findByType('form').props.onSubmit({ preventDefault: () => { } })
        })
        expect(mockCallback).toHaveBeenCalledTimes(0)
    })
})

describe('rendering new point form component without errors', () => {
    beforeEach(() => {
        mockCallback.mockClear()
        act(() => {
            component = create(<NewPointForm addNewPoint={mockCallback} noPointInCenter={true} />)
        })
        componentRoot = component.root
        input = componentRoot.findByType('input')
        act(() => {
            input.props.onChange(eventObject)
        })
    })

    test(`there is shouldn't be error input class if noPointInCenter is true`, () => {
        expect(input.props.className).toBe('newPointForm__input')
    })
    test(`there is shouldn't be error <div> message if noPointInCenter is true`, () => {
        expect(() => {
            componentRoot.findByProps({ className: 'newPointForm__errorText' })
        }).toThrow()
    })
    test(`component should call callback if noPointInCenter is true`, () => {
        act(() => {
            componentRoot.findByType('form').props.onSubmit({ preventDefault: () => { } })
        })
        expect(mockCallback).toHaveBeenCalledTimes(1)
        expect(mockCallback).toHaveBeenCalledWith('abc')
    })
})