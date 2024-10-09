import { Link } from 'react-router-dom';

// project import
import AuthWrapper from '../AuthWrapper';
import AuthLogin from '../auth-forms/AuthLoginAdmin';
import { Stack, Typography } from '@mui/material';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <div className="container mx-auto px-4">
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography  variant="h3">Admin Login</Typography>
          </Stack>
        <div className="">
          <AuthLogin />
        </div>
      </div>
    </AuthWrapper>
  );
}
