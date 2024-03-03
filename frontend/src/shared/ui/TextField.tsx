import React from 'react'
import {FieldProps, Field} from 'formik'
import {FormGroup, InputGroup, Intent, InputGroupProps} from '@blueprintjs/core'

interface Props extends InputGroupProps {
  name: string
  id: string
  label?: React.ReactNode
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  large?: boolean
  autoComplete?: string
  autoFocus?: boolean
  inline?: boolean
  role?: string
}

export const TextField = (props: Props) => {
  const {id, name, label, placeholder, type, large, autoComplete, autoFocus, inline, ...rest} =
    props
  return (
    <Field name={name}>
      {({field, form: {errors, touched}}: FieldProps) => {
        return (
          <FormGroup
            labelFor={id}
            inline={inline}
            helperText={touched[field.name] && (errors[field.name] as string)}
            intent={touched[field.name] && errors[field.name] ? Intent.DANGER : Intent.NONE}
            label={label}
          >
            <InputGroup
              {...field}
              type={type}
              large={large}
              id={id}
              placeholder={placeholder}
              intent={touched[field.name] && errors[field.name] ? Intent.DANGER : Intent.NONE}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              {...rest}
            />
          </FormGroup>
        )
      }}
    </Field>
  )
}
