import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { usePageError } from 'hooks/use-page-error'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { Button, Callout, Card, Elevation, H1, Intent } from '@blueprintjs/core'
import styles from './Login.module.scss'
import { TextField } from 'shared/ui/TextField'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { FlexContainer } from 'shared/ui/FlexContainer'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = usePageError('')
  const { login } = useContext(AuthContext)

  return (
    <FlexContainer centered style={{ height: '100vh' }}>
      <Card className={styles.loginBox} elevation={Elevation.ONE}>
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
            <Form className="box">
              <H1 className="title">Log in</H1>
              <TextField
                name="email"
                label="Email"
                id="email"
                placeholder="Email"
                autoComplete="email"
              />
              <TextField
                name="password"
                type="password"
                label="Password"
                id="password"
                placeholder="Password"
                autoComplete="current-password"
              />
              {error ? (
                <Callout intent={Intent.DANGER}>
                  Login failed. Please check your password and try again.
                </Callout>
              ) : null}
              <VerticalSpacing size="large" />
              <Button fill loading={false} type="submit" icon="log-in" intent={Intent.PRIMARY}>
                Login
              </Button>
            </Form>
          )}
        </Formik>
        {error && <p className="notification is-danger is-light">{error}</p>}
      </Card>
    </FlexContainer>
  )
}
