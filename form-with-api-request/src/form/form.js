import {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

export const Form = () => {
  // state
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })

  // submit event handler
  const handleSubmit = e => {
    e.preventDefault()

    // access to TextField component inputs by id destructuring
    const {name, size, type} = e.target.elements

    // set error messages
    if (!name.value) {
      setFormErrors(prevState => ({...prevState, name: 'The name is required'}))
    }
    if (!size.value) {
      setFormErrors(prevState => ({...prevState, size: 'The size is required'}))
    }
    if (!type.value) {
      setFormErrors(prevState => ({...prevState, type: 'The type is required'}))
    }
  }

  // blur event handler
  const handleBlur = e => {
    // access to TextField component inputs by name destructuring
    const {name, value} = e.target

    // set error messages
    setFormErrors({
      ...formErrors,
      [name]: value.length ? '' : `The ${name} is required`,
    })
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

        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}

export default Form
