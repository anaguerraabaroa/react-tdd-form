import {React, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Box from '@material-ui/core/Box'

import {saveProduct} from '../services/productServices'
import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS,
} from '../const/htttpStatus'

export const Form = () => {
  // form error messages state
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })
  // form submit button state
  const [isSaving, setIsSaving] = useState(false)

  // server success message
  const [isSuccess, setIsSuccess] = useState(false)

  // server error messages
  const [errorMessage, setErrorMessage] = useState('')

  // set validation error messages by field name state
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

  // get form values
  const getFormValues = ({name, size, type}) => ({
    name: name.value,
    size: size.value,
    type: type.value,
  })

  // handle fetch errors
  const handleFetchErrors = async err => {
    // set server error message state
    if (err.status === ERROR_SERVER_STATUS) {
      setErrorMessage('Unexpected error, please try again')
      return
    }

    // set server invalid request message state
    if (err.status === INVALID_REQUEST_STATUS) {
      const data = await err.json()
      setErrorMessage(data.message)
      return
    }
    // set not found service message state
    setErrorMessage('Connection error, please try later')
  }

  // submit button event handler
  const handleSubmit = async e => {
    e.preventDefault()

    // set submit button state
    setIsSaving(true)

    // access to TextField component inputs by id destructuring
    const {name, size, type} = e.target.elements

    // run form validation error messages function
    validateForm(getFormValues({name, size, type}))

    // control server responses
    try {
      // run fetch
      const response = await saveProduct(getFormValues({name, size, type}))

      // validate fetch response to throw success or error messages
      if (!response.ok) {
        throw response
      }

      // reset fields values and set server success message state
      if (response.status === CREATED_STATUS) {
        e.target.reset()
        setIsSuccess(true)
      }
      // run handleFetchErrors function
    } catch (err) {
      handleFetchErrors(err)
    }

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
    <Container maxWidth="xs">
      <CssBaseline />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        my={20}
      >
        <Typography component="h1" variant="h4" align="center" color="primary">
          <Box m={4}>Create Product</Box>
        </Typography>

        {isSuccess && <p>Product Stored</p>}

        <Typography color="error">{errorMessage}</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Material UI requires to add id to TextField component since 
    it returns labels+inputs that must be related through the id */}
            <Grid item xs={12}>
              <TextField
                label="name"
                id="name"
                name="name"
                helperText={formErrors.name}
                onBlur={handleBlur}
                error={!!formErrors.name.length}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="size"
                id="size"
                name="size"
                helperText={formErrors.size}
                onBlur={handleBlur}
                error={!!formErrors.size.length}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.type.length}>
                <InputLabel htmlFor="type">type</InputLabel>
                <Select
                  fullWidth
                  native
                  error={!!formErrors.type.length}
                  inputProps={{
                    name: 'type',
                    id: 'type',
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value="electronic">Electronic</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                </Select>
                <FormHelperText>
                  {!!formErrors.type && <p>{formErrors.type}</p>}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSaving}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default Form
