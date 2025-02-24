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
} from "@mui/material";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import images from "../../assets/map2.jpeg";
import Loader from "./Loder";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../axios";

function Ordertracking() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [updatemessage, setUpdatemessage] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");
  const [rows, setRows] = useState([]);

  const StatusChip = ({ status }) => {
    let color = "default";
    if (status === "Shipped") color = "primary";
    else if (status === "In Transit") color = "warning";
    else if (status === "Delivered") color = "success";

    return <Chip label={status} color={color} size="small" />;
  };

  const getallorder = async () => {
    setOpenLoader(true);
    setRows([]);

    setTimeout(async () => {
      try {
        const res = await axios.instance.get(
          `Getordersearchvalue?search=${searchvalue}`,{
            headers: {
              Authorization: sessionStorage.getItem('token'), 
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
          orderID:user.orderID
        }));

        if (formattedRows.length === 0) {
          setUpdatemessage(true);
        }

        setRows(formattedRows);
        setSearchvalue("");
      } catch (error) {
        console.error("Error fetching users:", error);
        setUpdatemessage(true);
      } finally {
        setOpenLoader(false);
      }
    }, 2000);
  };

  const columns = [
    
    { field: "orderID", headerName: "OrderID", flex: 1, minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Order Date",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {moment(params.value).format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>
      ),
    },
    { field: "product", headerName: "Product", flex: 1, minWidth: 150 },
   
    { field: "quantity", headerName: "Qty", flex: 0.5, minWidth: 80 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor:
              params.value === "Pending"
                ? "#FFA726"
                : params.value === "In Progress"
                ? "#42A5F5"
                : params.value === "Completed"
                ? "#66BB6A"
                : "#BDBDBD",
            color: "white",
            fontWeight: "bold",
          }}
        />
      ),
    },
   
    {
      field: "updatedAt",
      headerName: "Tracking Date",
      flex: 0.5,
      minWidth: 150,
      renderCell: (params) => {
        const row = params.row;
  
        if (row.status === "Pending") {
          return null; 
        }
  
        return (
          <Typography variant="body2">
            {moment(params.value).format("MMMM Do YYYY, h:mm:ss a")}
          </Typography>
        );
      },
    },
  ];

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
            theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.9)" : "rgba(255, 255, 255, 0.9)",
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

      {rows.length > 0 && (
        <Box
          sx={{
            width: "90%",
            maxWidth: isMobile ? 360 : 700,
            height: "auto",
            maxHeight: 300,
            backgroundColor: theme.palette.mode === "dark" ? "#121212" : "white",
            borderRadius: 3,
            padding: 2,
            boxShadow: 2,
            overflow: "auto",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={3}
            disableSelectionOnClick
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-root": {
                border: "none",
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              },
            }}
          />
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
