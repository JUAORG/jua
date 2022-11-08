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

const SUB_DOCUMENT = 'work'

export default function WorkHistoryForm(workDoc) {
  
  const [work, setWork] = useState(workDoc.workDoc)
  const formProps = useForm({ defaultValues: work })

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
    if (work) {
      values.id = get(work, "id")
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
          label="Company"
          {...register('company')}
        />
        <TextField
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
            fullWidth
            id="start_year"
            label="From"
            type="date"
            {...register('start_date')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="To"
            type="date"
            {...register('end_date')}
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
        {work && (
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
            onClick={() => deleteItem(work)}
            variant="contained">
            Delete
          </LoadingButton>
          </>
        )}
        {!work && (
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
