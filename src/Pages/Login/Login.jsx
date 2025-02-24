
import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Grid,
} from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import '../../index.css'
import Iconify from '../../components/Iconify';
// hooks
import axios from '../../axios';

import logoImage from '../../assets/logo.png';
import bg4 from '../../assets/bgx.jpeg';

import useResponsive from './useResponsive';
import { LoadingButton } from '@mui/lab';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundImage: `url("${bg4}")`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  mixBlendMode: 'multiply',
}));





const loginInitialValue = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Enter your Email'),
  password: Yup.string().max(15, 'Password is too long').required('Enter your password'),
});


export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorColor, setErrorColor] = useState('');
  const [loading, setLoading] = useState(false);

  

 

const handleLogin =async(values)=>{
  setLoading(true)
  const value = await axios.instance.post('/login',
    {
      email: values.email,
      password: values.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((res)=>{
    // if (re) {
      
    // }
    const { message, token, user } = res.data; 
setError(message)

    sessionStorage.setItem("token",'Bearer ' + token);
    sessionStorage.setItem("user", JSON.stringify(user)); 
    sessionStorage.setItem("isAuthProtected", true);
 
    navigate('/Dashboard')
          
  })
}

  return (
    <>
      
      <StyledRoot>
        <StyledSection>
          <Container
            maxWidth="md"
            style={{
              backgroundColor: 'inherit',
              borderRadius: mdUp ? '50px' : 0,
              padding: mdUp ? '0 16px' : 0,
            }}
            component={Paper}
            elevation={0}
          >
            <Grid
              container
              style={{
                background: '#D6EFD8',
                boxShadow:
                  'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
                minHeight: mdUp ? '60vh' : '100vh',
                maxHeight: mdUp ? '100vh' : 'auto',
                borderRadius: mdUp ? '50px' : 0,
              }}
            >
              <Grid item xs={12} md={5} sx={{ maxHeight: mdUp ? '100%' : '30%' }}>
                <Stack
                  justifyContent={'center'}
                  direction={'column'}
                  alignItems={'center'}
                  height={'100%'}
                  className="font_style1"
                >
                  <Stack
                    justifyContent={'center'}
                    direction={'column'}
                    alignItems={'center'}
                    p={3}
                    sx={{ maxHeight: mdUp ? '100%' : 'auto' }}
                  >
                    <img
                      src={logoImage}
                      style={{
                        objectFit: 'contain',
                        maxWidth: mdUp ? '100%' : '80%',
                      }}
                      alt="techveel logo"
                    />
                    {mdUp ? (
                      <Typography
                        variant="h4"
                        textAlign={'center'}
                        gutterBottom
                        className="font_style2"
                        style={{ color: 'black' }}
                        mt={4}
                      >
                        Customer Satisfaction is Our Moto
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        textAlign={'center'}
                        style={{ textTransform: 'uppercase' }}
                        gutterBottom
                        sx={{ marginTop: mdUp ? 'inherit' : '10px' }}
                      >
                        Welcome to <br />
                        <span style={{ textTransform: 'uppercase' }} className="font_style2">
                          WareGo
                        </span>
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={7} justifyContent={'center'} alignItems={'center'}>
                <Stack
                  spacing={3}
                  sx={{ backgroundColor: 'white', p: 3, pb: 3, height: '100%' }}
                  style={{
                    borderTopRightRadius: mdUp ? '50px' : 0,
                    borderBottomRightRadius: mdUp ? '50px' : 0,
                  }}
                  justifyContent={'center'}
                >
                  <Grid container spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Grid item xs={12} p={0}>
                      {mdUp ? (
                        <Typography variant="body2" textAlign={'center'} gutterBottom>
                          Welcome to <br />
                          <span style={{ textTransform: 'uppercase', color: '#0D9276' }} className="font_style3">
                          WareGo
                          </span>
                          <br />
                       
                        </Typography>
                      ) : (
                       <></>
                      )}
                    </Grid>
                  </Grid>
                 
                 
                  <Formik
             validationSchema={validationSchema}
             initialValues={loginInitialValue}
             onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
              <Form style={{ width: '100%' }}>
                <Stack spacing={2}>
                  <TextField
                    name="email"
                    label="Email"
                    size="small"
                    fullWidth
                    value={values.email}
                    error={!!errors.email && touched.email}
                    helperText={touched.email && errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ autoComplete: 'off' }}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    name="password"
                    label="Password"
                    type={showUserPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowUserPassword(!showUserPassword)} edge="end">
                            <Iconify icon={showUserPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.password && touched.password}
                    helperText={touched.password && errors.password}
                  />
                  <LoadingButton
                    size="large"
                    fullWidth
                    variant="contained"
                    loading={loading}
                    //onClick={gotodashboard}
                    onClick={(e) => {
                      submitForm(e);
                    }}
                  >
                    Login
                  </LoadingButton>
                </Stack>
              </Form>
            )}
          </Formik>
          {error && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color={errorColor} sx={{ textAlign: 'center' }}>
                                  {error}
                                </Typography>
                              </Grid>
                            )}
                  
                  
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </StyledSection>
      </StyledRoot>
    </>
  );
}
