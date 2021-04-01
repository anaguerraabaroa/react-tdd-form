import {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

import {saveProduct} from '../services/productServices'

export const Form = () => {
  // form error messages state
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })

  // form submit button state
  const [isSaving, setIsSaving] = useState(false)

  // set validation error messages by field name
  const validateField = ({name, value}) => {
    setFormErrors(prevState => ({
      ...prevState,
      [name]: value.length ? '' : `The ${name} is required`,
    }))
  }

  // run validation error messages by field name function
  const validateForm = ({name, size, type}) => {
    validateField({name: 'name', value: name})
    validateField({name: 'size', value: size})
    validateField({name: 'type', value: type})
  }

  // submit button event handler
  const handleSubmit = async e => {
    e.preventDefault()

    // set submit button state
    setIsSaving(true)

    // access to TextField component inputs by id destructuring
    const {name, size, type} = e.target.elements

    // run form validation error messages function
    validateForm({name: name.value, size: size.value, type: type.value})

    // run fetch
    await saveProduct()

    // update submit button state
    setIsSaving(false)
  }

  // input blur event handler
  const handleBlur = e => {
    // access to TextField component inputs by name destructuring
    const {name, value} = e.target

    // run validation error messages by field function
    validateField({name, value})
  }

  return (
    <>
      <h1>Create product</h1>

      <form onSubmit={handleSubmit}>
        {/* Material UI requires to add id to TextField component since 
    it returns labels+inputs that must be related through the id */}
        <TextField
          label="name"
          id="name"
          name="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
        />

        <TextField
          label="size"
          id="size"
          name="size"
          helperText={formErrors.size}
          onBlur={handleBlur}
        />

        <InputLabel htmlFor="type">type</InputLabel>

        <Select
          native
          value=""
          inputProps={{
            name: 'type',
            id: 'type',
          }}
        >
          <option aria-label="None" value="" />
          <option value={'electronic'}>Electronic</option>
          <option value={'furniture'}>Furniture</option>
          <option value={'clothing'}>Clothing</option>
        </Select>

        {formErrors.type.length && <p>{formErrors.type}</p>}

        <Button type="submit" disabled={isSaving}>
          Submit
        </Button>
      </form>
    </>
  )
}

export default Form
