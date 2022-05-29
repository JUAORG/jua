import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
export default function EducationHistoryForm() {

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
              fullWidth
              label="Institution/University"
              {...getFieldProps('institution')}
            />
            <TextField
              fullWidth
              label="Degree"
              {...getFieldProps('degreee')}
            />
            <TextField
              fullWidth
              label="Field of study"
              {...getFieldProps('field_of_study')}
            />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Start year"
              {...getFieldProps('start_year')}
            />
            <TextField
              fullWidth
              label="End year"
              {...getFieldProps('end_year')}
            />
          </Stack>
          <TextField
            fullWidth
            type="text"
            label="Description (optional)"
            {...getFieldProps('description')}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
