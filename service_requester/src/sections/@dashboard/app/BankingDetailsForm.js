import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// ----------------------------------------------------------------------
export default function BankingDetailsForm() {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField fullWidth label="Name" {...getFieldProps('name')} />
          <TextField fullWidth label="Bank" {...getFieldProps('bank')} />
          <TextField fullWidth label="Branch Code" {...getFieldProps('branch_code')} />
          <TextField fullWidth label="Account Number" {...getFieldProps('account_number')} />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={false}>
            Save
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
