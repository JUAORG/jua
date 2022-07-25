import react, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createId } from '../../../utils/uuid-generator'
import { addEducation, deleteEducation, editEducation } from '../../../actions/Education'

export default function ServiceRequestForm(juaNetworkUserId) {
  
  const [education, setEducation] = useState(juaNetworkUserId)
  const formProps = useForm({ defaultValues: education })

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = formProps

  const onSubmit = (values) => {
    if (education) {
      editEducation(values)
    }else{
      values.id = createId()
      addEducation(values)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Subject"
          {...register('subject')}
        />
          <TextField
            fullWidth
            id="date"
            label="Date"
            type="date"
            {...register('date')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        <TextField
          fullWidth
          type="text"
          label="Description (optional)"
          {...register('description')}
        />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Send Request
          </LoadingButton>
      </Stack>
    </form>
  )
}