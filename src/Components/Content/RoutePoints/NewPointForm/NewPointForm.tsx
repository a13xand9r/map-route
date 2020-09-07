import React from 'react'
import styles from './newPointForm.module.css'
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';



export const NewPointForm: React.FC<PropsType> = ({ addNewPoint, centerCoordinatesUpdated }) => {
    const submit = (values: FormValuesType, {resetForm}: FormikHelpers<{ newPoint: string }>) => {
        addNewPoint(values.newPoint)
        resetForm({})
    }
    const validateForm = (values: FormValuesType) => {
        if (!centerCoordinatesUpdated) {
            if (values.newPoint){
                return {
                    newPoint: 'В этом месте уже есть точка маршрута'
                }
            }
        }
        return {}
    }
    return (
        <div className={styles.newPointForm}>
            <Formik initialValues={{ newPoint: '' }}
                onSubmit={submit}
                validate={validateForm}
            >
                {({errors}) => (
                    <Form>
                        <label htmlFor='newPoint'>Новая точка</label>
                        <Field
                            name='newPoint'
                            type='input'
                            autoComplete='off'
                            placeholder='Введите новую точку маршрута'
                            className={`${styles.newPointForm__input} ${errors.newPoint && !centerCoordinatesUpdated ? styles.newPointForm__input_error : null}` }
                        />
                        {errors.newPoint && !centerCoordinatesUpdated &&  <div className={styles.newPointForm__errorText}>{errors.newPoint}</div>}
                        {/* <ErrorMessage name='newPoint' component='div' className={styles.newPointForm__errorText} /> */}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

type PropsType = {
    addNewPoint: (newPointName: string) => void
    centerCoordinatesUpdated: boolean
}
type FormValuesType = {
    newPoint: string
}