import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createId } from '../../../utils/uuid-generator'
import { addWork, deleteWork, editWork } from '../../../actions/Work'

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
      console.log(work)
      values.id = get(work, "id")
      editWork(values)
    }else{
      values.id = createId()
      addWork(values)
    }
  }

  const deleteItem = () => {
    deleteWork(work)
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