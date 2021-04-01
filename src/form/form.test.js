import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {Form} from './form'
import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS,
} from '../const/htttpStatus'

// create mock server and send form data to get server responses
const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const {name, size, type} = req.body

    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS))
    }
    return res(ctx.status(ERROR_SERVER_STATUS))
  }),
)

// start mock server
beforeAll(() => server.listen())

// close mock server
afterAll(() => server.close())

// beforeEach is used in global scope to render the component before each test
beforeEach(() => render(<Form />))

// reset any runtime request handlers added during the tests (custom server response)
afterEach(() => server.resetHandlers())

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
    // before the event error message should not be in the document
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    // event click to send data to the server
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // after the event error message should be in the document
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()

    // wait for the server response to run the test. waitFor returns a Promise when it runs as a function
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled(),
    )
  })
})

describe('when the user blurs an empty field', () => {
  // test name field error message on blur
  it('should display a validation error message for the input name', () => {
    // before the event the error message on empty name field should not be in the document
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

    // event receives two values: element + event target
    // and event target receives two values: input name + empty input value
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'name', value: ''},
    })

    // after the event the error message on empty name fields should be in the document
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
  })

  // test size field error message on blur
  it('should display a validation error message for the size name', () => {
    // before the event the error message on empty size field should not be in the document
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()

    //event
    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: {name: 'size', value: ''},
    })

    // after the event the error message on empty size field should be in the document
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})

describe('when the user submits the form properly and the server returns created status', () => {
  // test form disabled submit button
  it('should the submit button be disabled until the request is done', async () => {
    // before the event the button should be enabled
    const submitBtn = screen.getByRole('button', {name: /submit/i})
    expect(submitBtn).not.toBeDisabled()

    // event
    fireEvent.click(submitBtn)

    // after the event the button should be disable
    expect(submitBtn).toBeDisabled()

    // wait for the server response to run the test
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
  })

  // test success message
  it('the form page must display the success message "Product stored" and clean the fields values', async () => {
    // variables
    const nameInput = screen.getByLabelText(/name/i)
    const sizeInput = screen.getByLabelText(/size/i)
    const typeSelect = screen.getByLabelText(/type/i)

    // change event to keep fields values
    fireEvent.change(nameInput, {
      target: {name: 'name', value: 'my product'},
    })
    fireEvent.change(sizeInput, {
      target: {name: 'name', value: '10'},
    })
    fireEvent.change(typeSelect, {
      target: {name: 'name', value: 'electronic'},
    })

    // click event to send fields values to the server
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // wait for the success server response to run the test
    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    )

    // reset fields values
    expect(nameInput).toHaveValue('')
    expect(sizeInput).toHaveValue('')
    expect(typeSelect).toHaveValue('')
  })
})

describe('when submits the form and the server returns an unexpected error', () => {
  // test server error message
  it('the form page must display the error message "Unexpected error, please try again"', async () => {
    // event
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // wait for the error server response to run the test
    await waitFor(() =>
      expect(
        screen.getByText(/unexpected error, please try again/i),
      ).toBeInTheDocument(),
    )
  })
})

describe('when submits the form and the server returns an invalid request error', () => {
  // test server invalid request message
  it('the form page must display the error message "The form is invalid, the fields name, size, type are required"', async () => {
    // custom server response just for this test
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res(
          ctx.status(INVALID_REQUEST_STATUS),
          ctx.json({
            message:
              'The form is invalid, the fields name, size, type are required',
          }),
        )
      }),
    )

    // event
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // wait for the invalid request server response to run the test
    await waitFor(() =>
      expect(
        screen.getByText(
          /the form is invalid, the fields name, size, type are required/i,
        ),
      ).toBeInTheDocument(),
    )
  })
})

describe('when submits the form and the server returns a not found service error', () => {
  // test not found service
  it('the form page must display the message "Connection error, please try later"', async () => {
    // server response
    server.use(
      rest.post('/products', (req, res) =>
        res.networkError('Failed to connect'),
      ),
    )

    // event
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    // wait for the invalid request server response to run the test
    await waitFor(() =>
      expect(
        screen.getByText(/connection error, please try later/i),
      ).toBeInTheDocument(),
    )
  })
})
