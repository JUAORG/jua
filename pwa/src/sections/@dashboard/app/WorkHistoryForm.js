import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import notificationManager from '../../../actions/NotificationManager'
import { createId } from '../../../utils/uuid-generator'
import { addWork, deleteWork, editWork } from '../../../actions/Work'
import {
  addRecordUnderUserDoc,
  updateRecordUnderUserDoc,
  deleteRecordUnderUserSubDoc
} from '../../../actions/GeneralFunctions'
import {
  createUserExperience,
  updateUserExperience,
  deleteUserExperience
} from '../../../actions/Profile'

const SUB_DOCUMENT = 'work'

export default function WorkHistoryForm(workDoc) {
  const [experience, setExperience] = useState(workDoc.workDoc)
  const formProps = useForm({ defaultValues: experience })

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
    if (experience) {
      values.ref = get(experience, "ref")
      updateUserExperience(values)
        .then(() => {
          notificationManager.success('Profile updated', 'Success')
        }).catch((error) => {
          notificationManager.error(error, 'Error')
        })
    }else{
      createUserExperience(values)
        .then(() => {
          notificationManager.success('Profile updated', 'Success')
        }).catch((error) => {
          notificationManager.error(error, 'Error')
        })
    }
  }
  
  const deleteItem = (values) => {
    deleteUserExperience(values)
      .then(() => {
        notificationManager.success('Profile updated', 'Success')
      }).catch((error) => {
        notificationManager.error(error, 'Error')
      })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Company"
          {...register('company')}
        />
        <TextField
          required
          fullWidth
          label="title"
          {...register('title')}
        />
        <Stack
          spacing={ 2 }
          sx={{ float: "right" }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            required
            fullWidth
            id="start_year"
            label="From"
            type="date"
            {...register('date_from')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="To"
            type="date"
            {...register('date_to')}
            helperText="If present, leave empty"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
        </Stack>
        <TextField
          fullWidth
          type="text"
          label="Description (optional)"
          {...register('description')}
        />
        {experience && (
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
            onClick={() => deleteItem(experience)}
            variant="contained">
            Delete
          </LoadingButton>
          </>
        )}
        {!experience && (
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
