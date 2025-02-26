import React, { useState,useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  IconButton,
  Stack,
  useMediaQuery,
  Chip,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Loader from "./Loder";
import axios from "../../axios";
import backgroundImage from "../../assets/map2.jpeg";

function Ordertracking() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [updatemessage, setUpdatemessage] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");
  const [rows, setRows] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Pending", "In Progress", "Completed"];
 const navigate = useNavigate();
   const [sessionExpired, setSessionExpired] = useState(false);
  const getallorder = async () => {
    setOpenLoader(true);
    setRows([]);

    try {
      const res = await axios.instance.get(
        `Getordersearchvalue?search=${searchvalue}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const formattedRows = res.data.map((user) => ({
        id: user._id,
        product: user.product,
        quantity: user.quantity,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        orderID: user.orderID,
      }));

      if (formattedRows.length === 0) {
        setUpdatemessage(true);
        setActiveStep(0);
        setTimeout(() => {
          setUpdatemessage(false);
        }, 2000);
      } else {
        setRows(formattedRows);
        setSearchvalue("");

        const maxStep = Math.max(
          ...formattedRows.map((row) => steps.indexOf(row.status))
        );
        setActiveStep(maxStep);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setUpdatemessage(true);
      setActiveStep(0);
    } finally {
      setTimeout(() => {
        setOpenLoader(false);
      }, 2000);
    }
  };
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    const checkSessionExpiration = () => {
      const expirationTime = sessionStorage.getItem("sessionExpiration");

      if (expirationTime && Date.now() > expirationTime) {
        setSessionExpired(true); 
      }
    };

    const interval = setInterval(checkSessionExpiration, 10000);
    return () => clearInterval(interval);
  }, [])
  

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: isMobile ? 2 : 4,
        py: isMobile ? 2 : 6,
      }}
    >
      <Card
        sx={{
          width: isMobile ? "90%" : "100%",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: theme.palette.mode === "dark" ? "#141B2D" : "rgba(255, 255, 255, 0.9)",
          color: theme.palette.mode === "dark" ? "#141B2D" : "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardContent>
          
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            Track Your Order Status
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={searchvalue}
            onChange={(e) => setSearchvalue(e.target.value)}
            placeholder="Enter your Order ID"
            sx={{ borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={getallorder} color="primary">
                    <ArrowRightIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>

        <CardContent>
        <Stepper activeStep={activeStep} alternativeLabel>
  {steps.map((step, index) => (
    <Step key={step} completed={index <= activeStep}>
      <StepLabel
         icon={
          index < activeStep ? (
            <HourglassTopIcon color="success" fontSize="large" />
          ) : index == activeStep ? ( 
            step.label == "Pending" ? (
              <PendingActionsIcon color="warning" fontSize="large" />
            ) : step.label == "In Progress" ? (
              <HourglassTopIcon color="primary" fontSize="large" />
            ) : (
              <CheckCircleIcon color="success" fontSize="large" />
            )
          ) : (
            <HourglassTopIcon fontSize="large" /> 
          )
        }
      >
        {step}
      </StepLabel>
    </Step>
  ))}
</Stepper>

        </CardContent>

        <Box
          sx={{
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "white",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
          }}
        >
          {rows.length > 0 ? (
            rows.map((row) => (
              <Card key={row.orderID} sx={{ borderRadius: 2, boxShadow: 2, mb: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Order ID: {row.orderID}
                  </Typography>
                  <Typography>Product: {row.product}</Typography>
                  <Typography>Quantity: {row.quantity}</Typography>
                  <Typography>
                    Order Date: {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                  </Typography>
                  {row.status !== "Pending" && (
                    <Typography>
                      Tracking Date: {moment(row.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                  )}
                  <Chip
                    label={row.status}
                    sx={{
                      mt: 1,
                      backgroundColor:
                        row.status === "Pending"
                          ? "#FFA726"
                          : row.status === "In Progress"
                          ? "#42A5F5"
                          : "#66BB6A",
                      color: "white",
                    }}
                  />
                </CardContent>
              </Card>
            ))
          ) : (
<></>       
   )}
        </Box>
      </Card>

      {updatemessage && (
        <SweetAlert title="No Order Found"
        style={{
          backgroundColor: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          borderRadius: "10px",
        }}
        confirmBtnStyle={{
          backgroundColor: theme === "dark" ? "#42A5F5" : "#1976D2",
          color: "#fff",
        }}
        warning 
        showConfirm={false} 
    timeout={2000} 
    onConfirm={()=>setUpdatemessage(false)}
   
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
       {sessionExpired && (
                  <SweetAlert
                    title="Session Expired"
                    warning
                    confirmBtnText="OK"
                    confirmBtnBsStyle="danger"
                    onConfirm={handleLogout}
                  >
                    Your session has expired. Please log in again.
                  </SweetAlert>
                )}
    </Box>
  );
}

export default Ordertracking;
