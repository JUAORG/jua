import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
export default function UserProfileForm() {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="First name"
            {...getFieldProps('firstName')}
          />

          <TextField
            fullWidth
            label="Last name"
            {...getFieldProps('lastName')}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Country"
            {...getFieldProps('country')}
            
          />
          <TextField
            fullWidth
            label="Town/City"
            {...getFieldProps('town')}
         
          />
        </Stack>
        <TextField
          fullWidth
          disabled
          label="Date Of Birth"
          {...getFieldProps('dob')}
         
        />
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          {...getFieldProps('email')}
          
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Update
        </LoadingButton>
      </Stack>
    </Form>
  </FormikProvider>
  );
}
