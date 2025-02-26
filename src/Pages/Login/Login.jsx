import React,{useState} from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from '../../axios';
import Iconify from '../../components/Iconify';
import SweetAlert from "react-bootstrap-sweetalert";
import Loader from "./Loder";
import {
  TextField,  Dialog,
  Button,  IconButton,
  InputAdornment,
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import bg4 from "../../assets/bgx.jpeg";
import logoImage from "../../assets/test.jpg";
const loginInitialValue = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().max(15, 'Password is too long').required('Password is required'),
});

const LoginForm = () => {
    const [updatemessage, setUpdatemessage] = useState(false);
    const [openLoader, setOpenLoader] = useState(false);
    const [showUserPassword, setShowUserPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleLogin = async (values) => {
      setOpenLoader(true); 
    
      try {
        const res = await axios.instance.post( 
          '/login',
          {
            email: values.email,
            password: values.password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    
        const { token, user } = res.data;
        sessionStorage.setItem("token", 'Bearer ' + token);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("isAuthProtected", true);
        const expirationTime = Date.now() + 15 * 60 * 1000; // Session expires in 15 minutes
        sessionStorage.setItem("sessionExpiration", expirationTime);
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500);
      } catch (error) {
        setUpdatemessage(true);
      } finally {
        setTimeout(() => setOpenLoader(false), 1500); 
      }
    };
    


  return (
    <Box
      sx={{
        backgroundImage: `url(${bg4})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "120vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 4, backdropFilter: "blur(10px)", borderRadius: "20px" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={logoImage} alt="Logo" style={{ maxWidth: "80%", height: "auto" }} />
            </Grid>

            
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
              <Stack spacing={1} alignItems="center">
  <Typography variant="h4" fontWeight="bold" color="#485C85">
    Welcome Back
  </Typography>
  <Typography variant="h5" fontWeight="500" color="#485C85">
    Streamlining Your Inventory, Powering Your Business.
  </Typography>
</Stack>

                <Formik validationSchema={validationSchema} initialValues={loginInitialValue} onSubmit={handleLogin}>
                  {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
                    <Form>
                      <Stack spacing={2}>
                        <TextField
                          name="email"
                          label="Email"
                          size="small"
                          autoComplete="off"
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
                        <LoadingButton size="large" fullWidth variant="contained" loading={loading} 
                         onClick={(e) => {
                          submitForm(e);
                        }}>
                          Login
                        </LoadingButton>
                      </Stack>
                    </Form>
                  )}
                </Formik>
             
              </Stack>
            </Grid>
          </Grid>
        </Paper>
          {updatemessage && (
                  <SweetAlert
                    title="Invalid credentials!"
                    
                    warning
                    showConfirm={false}
                    timeout={2000}
                    onConfirm={() => setUpdatemessage(false)}
                  />
                )}
                   <Dialog
        open={openLoader}
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Stack justifyContent="center" alignItems="center">
          <Loader />
        </Stack>
      </Dialog>
      </Container>
    </Box>
  );
};

export default LoginForm;
