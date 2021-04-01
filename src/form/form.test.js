import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {Form} from './form'

// create mock server
const server = setupServer(
  rest.post('/products', (req, res, ctx) => res(ctx.status(201))),
)

// start mock server
beforeAll(() => server.listen())

// close mock server
afterAll(() => server.close())

// beforeEach is used in global scope to render the component before each test
beforeEach(() => render(<Form />))

describe('when the form is mounted', () => {
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

describe('when the user submits the form without values', () => {
  // test form validation error messages
  it('should display validation messages', async () => {
    // before the event elements should not be in the document
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    // event
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // after the event elements should be in the document
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    // waitFor returns a Promise when it runs as a function
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled(),
    )
  })
})

describe('when the user blurs an empty field', () => {
  // test name field error message on blur
  it('should display a validation error message for the input name', () => {
    // before the event the element should not be in the document
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    // event receives two values: element + event target
    // and event target receives two values: input name + input value
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: ''},
    })

    // after the event the element should be in the document
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  // test size field error message on blur
  it('should display a validation error message for the size name', () => {
    // before the event the element should not be in the document
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    //event
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'size', value: ''},
    })

    // after the event the element should be in the document
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe('when the user submits the form', () => {
  // test form disabled submit button
  it('should the submit button be disabled until the request is done', async () => {
    // before the event the button should be enabled
    const submitBtn = screen.getByRole('button', {name: /submit/i})
    expect(submitBtn).not.toBeDisabled()

    // event
    fireEvent.click(submitBtn)

    // after the event the button should be disable
    expect(submitBtn).toBeDisabled()

    // waitFor returns a Promise when it runs as a function
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
  })
})
