import react, {useEffect} from 'react'
import { useForm } from "react-hook-form"
import { useParams } from 'react-router-dom'
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createServiceRequest } from '../../../actions/JuaNetwork'

export default function ServiceRequestForm({closeDialog, serviceRequest}) {
  const { juaNetworkUserId } = useParams()
  
  const formProps = useForm({ defaultValues: serviceRequest })
  
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
    values.serviceProvider = juaNetworkUserId
    createServiceRequest(values)
    closeDialog()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField 
          fullWidth
          required
          label="Subject"
          {...register('subject')} 
        />
        <TextField
          fullWidth
          id="date"
          label="Date"
          type="date"
          required
          {...register('date')}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
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
          variant="contained"
        >
          Send Request
        </LoadingButton>
      </Stack>
    </form>
  )
}