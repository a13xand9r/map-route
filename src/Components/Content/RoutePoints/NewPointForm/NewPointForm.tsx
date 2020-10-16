import React, { useState, FormEvent, ChangeEvent, memo } from 'react'
import styles from './NewPointForm.module.css'
import cn from 'classnames'

export const NewPointForm: React.FC<PropsType> = ({ addNewPoint, isNoPointInCenter }) => {
    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState('')
    const submit = (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault()
        if (inputValue && isNoPointInCenter){
            addNewPoint(inputValue)
            setInputValue('')
            setInputError('')
        }
        if (!inputValue){
            setInputError('Введите имя точки')
        }
    }
    const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        if (event.target.value && !isNoPointInCenter){
            setInputError('В этом месте уже есть точка маршрута')
        } else {
            setInputError('')
        }
    }
    const error = inputError && !isNoPointInCenter || inputError === 'Введите имя точки'
    return (
        <form onSubmit={submit} id='newPointForm' className={styles.newPointForm}>
            <input name='newPoint'
                type='text'
                autoComplete='off'
                onChange={onHandleChange}
                value={inputValue}
                id='newPointInput'
                title='При добавлении новая точка маршрута появится в центре карты'
                placeholder='Введите новую точку маршрута'
                className={cn(styles.newPointForm__input, { [styles.newPointForm__input_error]: error })} />
            {error && <div className={styles.newPointForm__errorText}>{inputError}</div>}
        </form>
    )
}
export const NewPointFormMemo: React.FC<PropsType> = memo(NewPointForm)

type PropsType = {
    addNewPoint: (newPointName: string) => void
    isNoPointInCenter: boolean
}