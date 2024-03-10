import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import cn from 'classnames'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { usePageError } from 'hooks/use-page-error'
import { FlexContainer } from 'shared/ui/FlexContainer'
import styles from './Login.module.scss'

function validateEmail(value: string) {
  if (!value) {
    return 'Email is required'
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/

  if (!emailPattern.test(value)) {
    return 'Email is not valid'
  }

  return null
}

function validatePassword(value: string) {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 6) {
    return 'At least 6 characters'
  }

  return null
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = usePageError('')
  const { login } = useContext(AuthContext)

  return (
    <FlexContainer centered style={{ height: '100vh' }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validateOnMount={true}
        onSubmit={({ email, password }) => {
          return login({ email, password })
            .then(() => {
              navigate(location.state?.from?.pathname || '/')
            })
            .catch((error) => {
              setError(error.response?.data?.message)
            })
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className={cn('box', styles.form)}>
            <h1 className="title">Log in</h1>
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
                  placeholder="e.g. bobsmith@gmail.com"
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
                Password
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
              <button
                type="submit"
                className={cn('button is-success has-text-weight-bold', {
                  'is-loading': isSubmitting,
                })}
                disabled={Boolean(isSubmitting || errors.email || errors.password)}
              >
                Log in
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </FlexContainer>
  )
}
