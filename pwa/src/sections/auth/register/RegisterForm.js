import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../actions/firebase'; // Adjust the path to your firebase.js config
import notificationManager from '../../../actions/NotificationManager';
import { SimpleBackdrop } from '../../../components/reusables/Backdrop';
import Iconify from '../../../components/Iconify';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const validatePassword = password => {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return (
      strongRegex.test(password) || 'Password must be at least 8 characters, include a number and an uppercase letter.'
    );
  };

  const onSubmit = async () => {
    const { email, password, firstName, lastName } = getValues();
    setIsLoading(true);

    try {
      // 🔎 Check if email is already registered
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('email', {
          type: 'manual',
          message: 'Email is already registered. Please log in instead.',
        });
        setIsLoading(false);
        return;
      }

      // ✅ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // 🗂️ Create Firestore user profile with snake_case keys
      await setDoc(doc(db, 'users', uid), {
        first_name: firstName,
        last_name: lastName,
        email,
        createdAt: new Date().toISOString(),
      });

      notificationManager.success('Account created. Please log in.', 'Success');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      const fallback = 'Registration failed. Please try again.';
      const message = error?.message || fallback;
      notificationManager.error(message, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <SimpleBackdrop />}
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            fullWidth
            label="First name"
            {...register('firstName', { required: 'First name is required' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            required
            fullWidth
            label="Last name"
            {...register('lastName', { required: 'Last name is required' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Stack>

        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Enter a valid email',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          autoComplete="new-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password', {
            required: 'Password is required',
            validate: validatePassword,
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(prev => !prev)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
          Register
        </LoadingButton>

        <p style={{ fontSize: '10px', marginTop: '10px', textAlign: 'center' }}>
          JUA Advisory is still in development mode. We are currently user testing the platform and adding final
          touches. Please feel free to register/sign in, experience the app, and give us feedback.
        </p>
      </Stack>
    </form>
  );
}
