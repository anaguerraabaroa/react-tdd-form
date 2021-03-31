import React from 'react'
import {screen, render} from '@testing-library/react'

import {Form} from './form'

describe('when the form is mounted', () => {
  // test product form page
  it('there must be a create product form page', () => {
    render(<Form />)

    // getByRole guarantees that the selected element is a heading
    expect(
      screen.getByRole('heading', {name: /create product/i}),
    ).toBeInTheDocument()
  })
})
