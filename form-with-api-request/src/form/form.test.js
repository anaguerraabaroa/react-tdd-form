import React from 'react'
import {screen, render, fireEvent} from '@testing-library/react'

import {Form} from './form'

describe('when the form is mounted', () => {
  // beforeEach to render the component before each test
  beforeEach(() => render(<Form />))

  // test form page
  it('there must be a create product form page', () => {
    // getByRole with name option is used to get elements by their accessible name
    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
  })

  // test form fields
  it('should exists the fields: name, size, type (electronic, furniture, clothing)', () => {
    // getByLabelText is used to get elements by label (form inputs)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()

    // queryByText is used to get elements by text (select options)
    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument()
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument()
  })

  // test form submit button
  it('should exists the submit button', () => {
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
  })
})

// test form validation messages
describe('when the user submits the form without values', () => {
  it('should display validation messages', () => {
    render(<Form />)

    // before the event the element should not be in the document
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    // event
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // after the event the element should be in the document
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()
  })
})
