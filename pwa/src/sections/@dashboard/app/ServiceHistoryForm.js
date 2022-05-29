import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
export default function ServiceHistroyForm() {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField fullWidth label="Company" {...getFieldProps('company')} />
          <TextField fullWidth label="Title" {...getFieldProps('title')} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="From YY/MM" {...getFieldProps('service_start')} />
            <TextField fullWidth label="To YY/MM" {...getFieldProps('service_end')} />
          </Stack>
          <TextField fullWidth type="text" label="Location (optional)" {...getFieldProps('location')} />
          <TextField fullWidth type="text" label="Description (optional)" {...getFieldProps('description')} />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
