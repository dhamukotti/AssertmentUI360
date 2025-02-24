import React, { useEffect, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,  MenuItem,
  Chip,IconButton, Button ,
  Grid,  Dialog,Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Login/Loder";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../axios";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ResponsiveBar } from "@nivo/bar";
import CardActionArea from "@mui/material/CardActionArea";
import Header from "../../components/Header";
import Modal from '@mui/material/Modal';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const Dashboard = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
    const [openLoader, setOpenLoader] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [countvalue, setCountvalue] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("all"); 

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  useEffect(() => {

    setOpenLoader(true);

  const timer = setTimeout(() => {
    setOpenLoader(false); 
  }, 2000 ); 
    const user = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = user?.role === "admin";
    const currentDate = new Date();
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const formattedDate = firstDayOfMonth.toISOString().split('T')[0];
    const today = new Date();

    const firstDateOfYear = new Date(new Date().getFullYear(), 0, 1);

  setFromDate(moment(firstDateOfYear).format('YYYY-DD-MM'))
    setToDate(moment(currentDate).format('YYYY-MM-DD'));
    if (isAdmin) {
      getAllOrders();
      Getallorderstatuscount();
    } else {
      getallorderuser();
      Getallorderstatuscountuser();
    }
    return () => clearTimeout(timer);
  }, []);

  const getAllOrders = async () => {
    try {
      const res = await axios.instance.get("/orders", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setRows(
        res.data.map((user) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
          orderID: user.orderID,
          createdAt: user.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getAllOrdersfilter = async () => {
    setOpenLoader(true)

    setTimeout(async () => {
    try {
      const res = await axios.instance.get(`/getreportfilter?status=${status}&fromDate=${fromDate}&toDate=${toDate}`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setRows(
        res.data.map((user) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
          orderID: user.orderID,
          createdAt: user.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    
  } finally {
    setOpenLoader(false);
    setOpen(false)
  }
}, 2000);
  };
  const getAllOrdersfilteruser = async () => {
    setOpenLoader(true)  
      const user = JSON.parse(sessionStorage.getItem("user"));


    setTimeout(async () => {
    try {
      const res = await axios.instance.get(`/getreportfilteruser?status=${status}&fromDate=${fromDate}&toDate=${toDate}&createdBy=${user?.id}`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setRows(
        res.data.map((user) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
          orderID: user.orderID,
          createdAt: user.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    
  } finally {
    setOpenLoader(false);
    setOpen(false)
  }
}, 2000);
  };
  const getallorderuser = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    try {
      const res = await axios.instance.get(
        `/Getoneorders?createdBy=${user?.id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      setRows(
        res.data.map((user) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
          orderID: user.orderID,
          createdAt: user.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const Getallorderstatuscount = async () => {
    try {
      const res = await axios.instance.get("/getallorderdashboard", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      setCountvalue(res.data);
      setData([
        { category: "Pending", count: res.data.pending || 0 },
        { category: "In Progress", count: res.data.inProgress || 0 },
        { category: "Completed", count: res.data.completed || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const Getallorderstatuscountfilter = async () => {
    setOpenLoader(true)  
      const user = JSON.parse(sessionStorage.getItem("user"));


    setTimeout(async () => {
    try {
      const res = await axios.instance.get(`/getallorderdashboardfilter?status=${status}&fromDate=${fromDate}&toDate=${toDate}`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setCountvalue(res.data);
      setData([
        { category: "Pending", count: res.data.pending || 0 },
        { category: "In Progress", count: res.data.inProgress || 0 },
        { category: "Completed", count: res.data.completed || 0 },
      ]);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    
  } finally {
    setOpenLoader(false);
    setOpen(false)
  }
}, 2000);
  };



  const Getallorderstatuscountfilteruser = async () => {
    setOpenLoader(true)  
      const user = JSON.parse(sessionStorage.getItem("user"));


    setTimeout(async () => {
    try {
      const res = await axios.instance.get(`/getallorderdashboardfilteruser?status=${status}&fromDate=${fromDate}&toDate=${toDate}&createdBy=${user?.id}`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      setCountvalue(res.data);
      setData([
        { category: "Pending", count: res.data.pending || 0 },
        { category: "In Progress", count: res.data.inProgress || 0 },
        { category: "Completed", count: res.data.completed || 0 },
      ]);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    
  } finally {
    setOpenLoader(false);
    setOpen(false)
  }
}, 2000);
  };

  const Getallorderstatuscountuser = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    try {
      const res = await axios.instance.get(
        `/getallorderdashboarduser?createdBy=${user?.id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      setCountvalue(res.data);
      setData([
        { category: "Pending", count: res.data.pending || 0 },
        { category: "In Progress", count: res.data.inProgress || 0 },
        { category: "Completed", count: res.data.completed || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const columns = [
    { field: "orderID", headerName: "Order ID", width: 120 },
    { field: "createdAt", headerName: "Order Date", flex: 1, minWidth: 150 },
    { field: "product", headerName: "Product", flex: 1, minWidth: 150 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 100 },
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
                : "#66BB6A",
            color: "white",
            fontWeight: "bold",
          }}
        />
      ),
    },
  ];

  const statusIcons = {
    pending: <PendingActionsIcon sx={{ fontSize: 40 }} color="warning" />,
    inProgress: <SyncIcon sx={{ fontSize: 40 }} color="info" />,
    completed: <CheckCircleIcon sx={{ fontSize: 40 }} color="success" />,
  };
  

  return (
    <Box m={isMobile ? "10px" : "20px"}>
     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

  <FilterAltIcon 
    sx={{ 
      fontSize: 36, 
      color: "#1976D2", 
      cursor: "pointer" 
    }} 
    onClick={handleOpen}
  />
</Box>


      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <CardContent sx={{ height: isMobile ? 250 : 300, p: 2 }}>
              <ResponsiveBar
                data={data}
                keys={["count"]}
                indexBy="category"
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                padding={0.4}
                layout="vertical"
                colors={({ index }) =>
                  ["#FFA726", "#42A5F5", "#66BB6A"][index]
                }
                borderRadius={4}
                borderWidth={2}
                borderColor={isDarkMode ? "#ffffff33" : "#00000022"}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: isMobile ? -15 : 0,
                  legend: "Order Status",
                  legendPosition: "middle",
                  legendOffset: 30,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Count",
                  legendPosition: "middle",
                  legendOffset: -35,
                }}
                enableGridY={false}
                labelSkipWidth={16}
                labelSkipHeight={16}
                labelTextColor={isDarkMode ? "#fff" : "#333"}
                animate={true}
                motionConfig="gentle"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
  <Grid container spacing={2}>
    {Object.entries(countvalue).map(([key, value]) => (
      <Grid item xs={6} key={key}>
        <Card
          sx={{
            height: "100%",
            backgroundColor:
              key === "pending"
                ? "#FFEBCC" 
                : key === "inProgress"
                ? "#D6EAF8" 
                : key === "completed"
                ? "#D4EDDA" 
                : "#F9F9F9", 
            color: "#000",
          }}
        >
          <CardActionArea sx={{ height: "100%", p: 2, textAlign: "center" }}>
            <CardContent>
              {statusIcons[key]}
              <Typography variant="h6" mt={1}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {value}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
</Grid>


      </Grid>

      <Box mt={2}>
        <Card sx={{ boxShadow: 3, borderRadius: "10px", p: 2 }}>
          <CardContent>
            <Typography variant="h6">Order List</Typography>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Modal keepMounted open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          mx: "auto",
          mt: 10,
          position: "relative",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Filter Orders
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            From Date
          </Typography>
          <TextField value={fromDate} onChange={(e) => setFromDate(e.target.value)} fullWidth type="date" />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            To Date
          </Typography>
          <TextField value={toDate} onChange={(e) => setToDate(e.target.value)} fullWidth type="date" />
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Status
          </Typography>
          <TextField select fullWidth label="Status" value={status} onChange={(e) => setStatus(e.target.value)} margin="normal">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button variant="contained" color="primary"
          onClick={()=>{
            const user = JSON.parse(sessionStorage.getItem("user"));
            const isAdmin = user?.role == "admin";
            if (isAdmin) {
              getAllOrdersfilter()
              Getallorderstatuscountfilter()
            }else{
              getAllOrdersfilteruser()
              Getallorderstatuscountfilteruser()
            }
          }}
          
          fullWidth>
            Apply Filter
          </Button>
        </Box>
      </Box>
    </Modal>
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
};

export default Dashboard;
