import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import cn from 'classnames'
import { usePageError } from 'hooks/use-page-error'
import { authService } from 'services/authService'
import { FlexContainer } from 'shared/ui/FlexContainer'
import Select from 'react-select/dist/declarations/src/Select'
import styles from './Register.module.scss'

function validateEmail(value: string) {
  if (!value) {
    return 'Заповніть email'
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/

  if (!emailPattern.test(value)) {
    return 'Email is not valid'
  }

  return null
}

const validatePassword = (value: string) => {
  if (!value) {
    return 'Заповніть пароль'
  }

  if (value.length < 6) {
    return 'Пароль має бути не менше 6 символів'
  }

  return null
}

const validateName = (value: string) => {
  if (!value) {
    return "Імʼя не може бути пустим"
  }

  return null
}

const validateRole = (value: string) => {
  if (value === 'Select role') {
    return 'Виберіть роль користувача'
  }

  return null
}

export const Register = () => {
  const [error, setError] = usePageError('')
  const [registered, setRegistered] = useState(false)

  if (registered) {
    return (
      <FlexContainer centered style={{ height: '100vh' }} column>
        <h1 className="title">Первірте вашу пошту</h1>
        <p>Ми відправили вам лист з посиланням для активації</p>
      </FlexContainer>
    )
  }

  return (
    <FlexContainer centered style={{ height: '100vh' }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          name: '',
          role: '',
        }}
        validateOnMount={true}
        onSubmit={({ email, password, name, role }, formikHelpers) => {
          formikHelpers.setSubmitting(true)

          authService
            .register({ email, password, name, role })
            .then(() => {
              setRegistered(true)
            })
            .catch((error) => {
              if (error.message) {
                setError(error.message)
              }

              if (!error.response?.data) {
                return
              }

              const { errors, message } = error.response.data

              formikHelpers.setFieldError('email', errors?.email)
              formikHelpers.setFieldError('password', errors?.password)
              formikHelpers.setFieldError('name', errors?.name)
              formikHelpers.setFieldError('role', errors?.role)

              if (message) {
                setError(message)
              }
            })
            .finally(() => {
              formikHelpers.setSubmitting(false)
            })
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className={cn('box', styles.form)}>
            <h1 className="title">Реєстрація</h1>
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  placeholder="bobsmith@gmail.com"
                  className={cn('input', {
                    'is-danger': touched.email && errors.email,
                  })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
                {touched.email && errors.email && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.email && errors.email && <p className="help is-danger">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="password" className="label">
                Пароль
              </label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="*******"
                  className={cn('input', {
                    'is-danger': touched.password && errors.password,
                  })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
                {touched.password && errors.password && (
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                )}
              </div>
              {touched.password && errors.password ? (
                <p className="help is-danger">{errors.password}</p>
              ) : (
                <p className="help">At least 6 characters</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="name" className="label">
                Імʼя
              </label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateName}
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Іван Іванов"
                  className={cn('input', {
                    'is-danger': touched.name && errors.name,
                  })}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              {touched.name && errors.name && <p className="help is-danger">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="role" className="label">
                Роль
              </label>
              <div className="control has-icons-left has-icons-right">
                <Field
                  validate={validateRole}
                  name="role"
                  as="select"
                  id="role"
                  className={cn('select', styles.selectBox, {
                    'is-danger': touched.role && errors.role,
                  })}
                >
                  <option value="">Виберіть Роль</option>
                  <option value="director">Director</option>
                  <option value="manager">Manager</option>
                </Field>
                <span className="icon is-small is-left">
                  <i className="fa fa-sitemap"></i>
                </span>
              </div>
              {touched.role && errors.role && <p className="help is-danger">{errors.role}</p>}
            </div>
            <div className="field">
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', {
                  'is-loading': isSubmitting,
                })}
                disabled={Boolean(
                  isSubmitting || errors.email || errors.password || errors.name || errors.role
                )}
              >
                Зареєструватися
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </FlexContainer>
  )
}
