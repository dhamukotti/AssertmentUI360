import React, { useState } from "react";
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
  StepContent,
  Paper,
  Button,
} from "@mui/material";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import images from "../../assets/map2.jpeg";
import Loader from "./Loder";
import axios from "../../axios";

function Ordertracking() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [updatemessage, setUpdatemessage] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const orderSteps = ["Pending", "In Progress", "Completed"];

  const getallorder = async () => {
    setOpenLoader(true);
    setOrderDetails(null);

    setTimeout(async () => {
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

        if (res.data.length === 0) {
          setUpdatemessage(true);
          return;
        }

        setOrderDetails(res.data[0]); // Assume only one order is returned
        setSearchvalue("");
      } catch (error) {
        console.error("Error fetching order:", error);
        setUpdatemessage(true);
      } finally {
        setOpenLoader(false);
      }
    }, 2000);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${images})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexDirection: "column",
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f4f6f8",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 400,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          padding: isMobile ? 2 : 4,
          borderRadius: 3,
          textAlign: "center",
          mb: 2,
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.mode === "dark" ? "#90caf9" : "#536493",
            mb: 2,
          }}
        >
          Track Your Order Status
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          autoComplete="off"
          value={searchvalue}
          onChange={(e) => setSearchvalue(e.target.value)}
          placeholder="Enter your Order ID"
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
            borderRadius: 2,
          }}
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
      </Box>

      {orderDetails && (
        <Box
          sx={{
            width: "90%",
            maxWidth: isMobile ? 360 : 600,
            backgroundColor:
              theme.palette.mode === "dark" ? "#121212" : "white",
            borderRadius: 3,
            padding: 3,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Order ID: {orderDetails.orderID}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Product: {orderDetails.product}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Quantity: {orderDetails.quantity}
          </Typography>

          <Stepper activeStep={orderSteps.indexOf(orderDetails.status)} orientation="vertical">
            {orderSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Chip
                    label={label}
                    sx={{
                      backgroundColor:
                        label == "Pending"
                          ? "#FFA726"
                          : label == "In Progress"
                          ? "#42A5F5"
                          : label == "Completed"
                          ? "#FFCA28"
                          : "#66BB6A",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </StepLabel>
                <StepContent>
                  <Typography variant="body2">
                    {(orderDetails.status) &&
                      moment(orderDetails.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )
                    }
                     {
                      moment(orderDetails.updatedAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )
                    }
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Paper
            square
            elevation={0}
            sx={{ p: 2, mt: 2, backgroundColor: "#f5f5f5" }}
          >
            <Typography>
              {orderDetails.status == "Completed"
                ? "Your order has been delivered!"
                : "Your order is being processed."}
            </Typography>
          </Paper>
        </Box>
      )}

      {updatemessage && (
        <SweetAlert
          title="No Order Found"
          timeout={2000}
          warning
          onConfirm={() => setUpdatemessage(false)}
          style={{ textAlign: "center" }}
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
    </Box>
  );
}

export default Ordertracking;
