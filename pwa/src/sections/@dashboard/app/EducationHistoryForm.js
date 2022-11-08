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
      values.id = get(education, "id")
      updateRecordUnderUserDoc(values, SUB_DOCUMENT)
    }else{
      values.id = createId()
      addRecordUnderUserDoc(values, SUB_DOCUMENT)
    }
  }

  const deleteItem = (values) => {
    deleteRecordUnderUserSubDoc(values, SUB_DOCUMENT)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Institution/University"
          {...register('institution')}
        />
        <TextField
          fullWidth
          label="Degree"
          {...register('degree')}
        />
        <TextField
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
            fullWidth
            id="start_year"
            label="Start Year"
            type="date"
            {...register('start_date')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="End Year"
            type="date"
            {...register('end_date')}
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
