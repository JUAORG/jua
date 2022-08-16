import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { useForm } from "react-hook-form"
import { useParams } from 'react-router-dom'
import {
  Stack,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { getAuthId } from '../../../actions/Auth'
import { createServiceRequest, updateServiceRequest, serviceRequestStatusOptions } from '../../../actions/JuaNetwork'


export default function ServiceRequestForm({closeDialog, serviceRequest, isServiceProvider}) {
  const { juaNetworkUserId } = useParams()
  const formProps = useForm({ defaultValues: serviceRequest })
  const [serviceRequestStatus, setServiceRequestStatusValue] = useState("read")
  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    defaultValues,
    handleSubmit,
    formState: { errors },
  } = formProps

  const onSubmit = (values) => {
    if (get(serviceRequest, "id") && isServiceProvider) {
      values = {} 
      values.id = get(serviceRequest, "id")
      values.status = serviceRequestStatus
      console.log(values)
      updateServiceRequest(values)
    }else if (get(serviceRequest, "id") && !isServiceProvider) {
      alert("Update feature coming soon")
    }else{
      values.serviceProvider = juaNetworkUserId
      createServiceRequest(values)
    }
    closeDialog()
  }

  const handleUpdateServiceRequestStatus = (event) => {
    setServiceRequestStatusValue(event.target.value)
    setValue("status", event.target.value)
    
  }
  
  const renderServiceProviderForm = () => {
    return (
      <FormControl>
        <FormLabel>Status</FormLabel>
        <RadioGroup
          row
          name="status"
          value={serviceRequestStatus}
          onChange={handleUpdateServiceRequestStatus}
        >
          <FormControlLabel
            control={<Radio />}
            value={get(serviceRequestStatusOptions, "accepted" )}
            label={get(serviceRequestStatusOptions, "accepted" )}
          />
          <FormControlLabel
            control={<Radio />}
            value={get(serviceRequestStatusOptions, "declined" )}
            label={get(serviceRequestStatusOptions, "declined" )}
          />
        </RadioGroup>
      </FormControl>
    )
  }

  const renderServiceRequesterForm = () => {
    return (
      <>
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
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        { !isServiceProvider && renderServiceRequesterForm() }
        { isServiceProvider && renderServiceProviderForm() }
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={false}
          variant="contained"o
        >
          {get(serviceRequest, "id") ? "Update" : "Send Request"}
        </LoadingButton>
      </Stack>
    </form>
  )
}
