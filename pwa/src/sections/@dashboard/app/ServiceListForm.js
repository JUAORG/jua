import { useState } from 'react'
import { useForm } from "react-hook-form"
import { Stack, TextField, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import notificationManager from '../../../actions/NotificationManager'
import { createUserService, deleteUserService, updateUserService } from '../../../actions/Profile'


export default function ServiceListForm(serviceDoc) {
  
  const [service, setService] = useState(serviceDoc.serviceDoc)
  const formProps = useForm({ defaultValues: service })

  const {
    register,
    handleSubmit,
  } = formProps

  const onSubmit = (values) => {
    if (service) {
      updateUserService(values, 'services')
    }else{
      createUserService(values, 'services')
    }
  }

  const deleteItem = (service) => {
    deleteUserService(service, 'services')
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack
          spacing={2}
          sx={{float: "right"}}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            fullWidth
            label="Service"
            {...register('name')}
          />
          <TextField
            fullWidth
            type="number"
            label='Price'
            placeholder="1500"
            { ...register('price') }
            InputProps={{
              startAdornment:
              <InputAdornment position="start">R</InputAdornment>,
            }}
          />
        </Stack>
        <TextField
          fullWidth
          type="text"
          label="Short Description (optional)"
          {...register('description')}
        />
        {service && (
          <>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Update
          </LoadingButton>
          <LoadingButton
            fullWidth
            size="large"
            loading={false}
            onClick={() => deleteItem(service)}
            variant="contained">
            Delete
          </LoadingButton>
          </>
        )}
        {!service && (
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Add
          </LoadingButton>
        )}
      </Stack>
    </form>
  )
}
