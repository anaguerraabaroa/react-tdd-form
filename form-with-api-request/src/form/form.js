import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'

export const Form = () => (
  <>
    <h1>Create product</h1>
    {/* Material UI requires to add id to TextField since 
    it returns labels and inputs that must be related */}
    <form>
      <TextField label="name" id="name" />

      <TextField label="size" id="size" />

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
    </form>
  </>
)

export default Form
