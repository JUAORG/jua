import react, { useState } from 'react'
import { get } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import notificationManager from '../../../actions/NotificationManager'
import { createId } from '../../../utils/uuid-generator'
import {
  addEducation,
  editEducation,
  deleteEducation,
} from '../../../actions/Education'
import {
  addRecordUnderUserDoc,
  updateRecordUnderUserDoc,
  deleteRecordUnderUserSubDoc
} from '../../../actions/GeneralFunctions'
import {
  createUserEducation,
  updateUserEducation,
  deleteUserEducation
} from '../../../actions/Profile'

const SUB_DOCUMENT = 'education'

export default function EducationHistoryForm(educationDoc) {

  const [education, setEducation] = useState(educationDoc.educationDoc)
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
      values.ref = get(education, "ref")
      updateUserEducation(values)
        .then(() => {
          notificationManager.success('Profile updated', 'Success')
        }).catch((error) => {
          notificationManager.error(error, 'Error')
        })
    }else{
      createUserEducation(values)
        .then(() => {
          notificationManager.success('Profile updated', 'Success')
        }).catch((error) => {
          notificationManager.error(error, 'Error')
        })
    }
  }

  const deleteItem = (values) => {
    deleteUserEducation(values)
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
          label="Institution/University"
          {...register('institution')}
        />
        <TextField
          required
          fullWidth
          label="Course"
          {...register('course')}
        />
        <TextField
          required
          fullWidth
          label="Field of study"
          {...register('field_of_study')}
        />
        <Stack
          sx={{float: "right"}}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >
          <TextField
            required
            fullWidth
            id="start_year"
            label="Start Year"
            type="date"
            {...register('date_from')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="End Year"
            type="date"
            {...register('date_to')}
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
        {education && (
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
            onClick={() => deleteItem(education)}
            variant="contained">
            Delete
          </LoadingButton>
          </>
        )}
        {!education && (
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
