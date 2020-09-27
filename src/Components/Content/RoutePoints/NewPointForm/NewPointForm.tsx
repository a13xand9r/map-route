import React, { useState, FormEvent, ChangeEvent } from 'react'
import styles from './newPointForm.module.css'
import cn from 'classnames'


export const NewPointForm: React.FC<PropsType> = ({ addNewPoint, isNoPointInCenter: noPointInCenter }) => {
    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState('')
    const submit = (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault()
        if (inputValue && noPointInCenter){
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
        if (event.target.value && !noPointInCenter){
            setInputError('В этом месте уже есть точка маршрута')
        } else {
            setInputError('')
        }
    }
    const error = inputError && !noPointInCenter
    return (
        <div className={styles.newPointForm}>
            <form onSubmit={submit}>
                <input name='newPoint'
                    type='text'
                    autoComplete='off'
                    onChange={onHandleChange}
                    value={inputValue}
                    placeholder='Введите новую точку маршрута'
                    className={cn(styles.newPointForm__input, { [styles.newPointForm__input_error]: error })} />
                {error && <div className={styles.newPointForm__errorText}>{inputError}</div>}
            </form>
        </div>
    )
}

type PropsType = {
    addNewPoint: (newPointName: string) => void
    isNoPointInCenter: boolean
}