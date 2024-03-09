import { Spinner } from '@blueprintjs/core'
import { Loader } from '../../app/App'

import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { FlexContainer } from 'shared/ui/FlexContainer'

export const AccountActivationPage = () => {
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const { activate } = useContext(AuthContext)
  const { activationToken } = useParams()

  console.log('------activationToken------', activationToken)

  useEffect(() => {
    if (!activationToken) {
      return
    }
    console.log('enter use useEffect')
    activate(activationToken)
      .catch((error) => {
        setError(error.response?.data?.message || `Wrong activation link`)
      })
      .finally(() => {
        setDone(true)
      })
  }, [])

  if (!done) {
    return <Loader />
  }

  return (
    <FlexContainer centered style={{ height: '100vh' }} column>
      <h1 className="title">Account activation</h1>

      {error ? (
        <p className="notification is-danger is-light">{error}</p>
      ) : (
        <>
          <p className="notification is-success is-light">Your account is now active</p>
          <Link to="orders/">Go back to the platform</Link>
        </>
      )}
    </FlexContainer>
  )
}
