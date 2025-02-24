import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Iconify from '../../components/Iconify';

import {
  Box,
  Modal,
  useMediaQuery,
  InputAdornment,
  useTheme,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import { Chip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "../../axios";
import SweetAlert from "react-bootstrap-sweetalert"
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rows, setRows] = useState([]);
const [successmessage, setSuccessmessage] = useState(false)
const [updatemessage, setUpdatemessage] = useState(false)
const [deletemessage, setDeletemessage] = useState(false)
const [showUserPassword, setShowUserPassword] = useState(false);
const [deleteid, setDeleteid] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const handleClose1 = () => setShow(false);
 

  useEffect(() => {
    Getalluser();
  }, []);

  const validate = () => {
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required.";
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email.";
    }

    if (!editMode && !formData.password.trim()) {
      tempErrors.password = "Password is required.";
    } else if (!editMode && formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.role) {
      tempErrors.role = "Please select a role.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const Getalluser = async () => {
    try {
      const res = await axios.instance.get("/Getalluser",{
        headers: {
          Authorization: sessionStorage.getItem('token'), 
          "Content-Type": "application/json",
        },
      });
      const formattedRows = res.data.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setFormData({ name: "", email: "", password: "", role: "" });
    setOpen(true);
  };

  const handleEdit = (user) => {
    console.log(user)
    setEditMode(true);
    setSelectedUserId(user.id);
    setFormData({ name: user.name, email: user.email, password:user.password, role: user.role });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editMode) {
        await axios.instance.put(
          `/Updateuser/${selectedUserId}`,
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
          },
          {
            headers: {
              Authorization: sessionStorage.getItem('token'), 
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.instance.post("/Register", formData, {
          headers: {Authorization: sessionStorage.getItem('token'),
            "Content-Type": "application/json" },
        });
      }
      
      Getalluser();
      handleClose();
      setUpdatemessage(true)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", email: "", password: "", role: "" });
    setSelectedUserId(null);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 0.5, minWidth: 120 },
    { 
      field: "role", 
      headerName: "Role", 
      flex: 0.5, 
      minWidth: 80, 
      renderCell: (params) => (
        <Chip 
        label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
        sx={{
            backgroundColor: params.value == "admin" ? "#DCF6E1" : "#FCEFDB",
            color: params.value == "admin" ? "#2C863C" : "#F1B34C",
            fontWeight: 500,
            fontSize:15
          }} 
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="secondary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDelete = async (id) => {
    setDeleteid(id)
  setShow(true)
  };


  const DeleteBank = async () => {
    const delte = await axios.instance
      .delete(`/UserDelete/${deleteid}`, {
        headers: {
         Authorization: sessionStorage.getItem('token'),
          "Content-Type": "application/json",

        },
      })
      .then(res => {
        Getalluser()
        setShow(false)
       setDeletemessage(true)
          
        
      })
  }
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="User" subtitle="User Management" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:hover": { backgroundColor: colors.blueAccent[700] },
          }}
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>

      <Box
        sx={{
          height: 400,
          width: "100%",
          overflowX: isMobile ? "auto" : "hidden",
          "& .MuiDataGrid-root": { fontSize: isMobile ? "12px" : "14px" },
        }}
      >
        {/* <DataGrid  rows={rows} columns={columns} pageSizeOptions={[5, 10]} disableRowSelectionOnClick autoHeight /> */}
    
        <DataGrid
  rows={rows}
  columns={columns}
  pageSizeOptions={[5]}
  pageSize={5}
  pagination
  disableSelectionOnClick
  autoHeight
/>
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {editMode ? "Edit User" : "User Registration"}
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField 
            fullWidth label="Name"
             name="name"
              value={formData.name}
               onChange={handleChange} margin="normal"
                required 
                autoComplete="off"
                error={!!errors.name} 
                helperText={errors.name} />
            <TextField fullWidth label="Email"
             name="email" type="email" 
             value={formData.email} 
             onChange={handleChange}
              margin="normal" 
               autoComplete="off"
              required 
              error={!!errors.email} 
              helperText={errors.email} />
         
            <TextField fullWidth
             label="Password"
             name="password"
          
               autoComplete="off"
              value={formData.password} 
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
              onChange={handleChange} 
              margin="normal"
               required error={!!errors.password} 
               helperText={errors.password}
               
               
               />
            <TextField select 
            fullWidth
             label="Role"
              name="role"
               value={formData.role}
                onChange={handleChange} 
                margin="normal" 
                required 
                error={!!errors.role} 
                helperText={errors.role}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button onClick={handleClose} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">{editMode ? "Update" : "Submit"}</Button>
            </Box>
          </form>
        </Box>
      </Modal>
      {successmessage ? (
        <SweetAlert
          title="User Added Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setSuccessmessage(false)
          }}
         
        ></SweetAlert>
      ) : null}


{deletemessage ? (
        <SweetAlert
          title="User Deleted Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setDeletemessage(false)
          }}
         
        ></SweetAlert>
      ) : null}
      {updatemessage ? (
        <SweetAlert
          title="User Updated Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setUpdatemessage(false)
          }}
         
        ></SweetAlert>
      ) : null}
  <Modal open={show} onClose={handleClose} aria-labelledby="modal-title" centered>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 100, color: "orange" }} />
        <Typography variant="h5" id="modal-title" gutterBottom>
          Are you sure?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          You won&apos;t be able to revert this!
        </Typography>
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={DeleteBank}>
            Yes, delete it!
          </Button>
          <Button variant="contained" color="error" onClick={handleClose1}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
    </Box>
  );
}

export default Register;
