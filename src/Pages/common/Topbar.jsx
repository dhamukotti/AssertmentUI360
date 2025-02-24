import { Box, IconButton, useTheme } from "@mui/material";
import { useContext,useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Menu, MenuItem, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import profile from '../../assets/jj.jpg'
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

const logout = ()=>{
  navigate('/')
  sessionStorage.setItem('isAuthProtected',false)
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('token')
}
const [anchorEl, setAnchorEl] = useState(null); 
const open = Boolean(anchorEl); 


const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};


const handleClose = () => {
  setAnchorEl(null);
};


const handleMenuItemClick = (action) => {
  handleClose(); 
  logout()
};

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
    
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
     
      </Box>

    
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      
        
       
         <Stack direction="row" spacing={2}>
         <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "avatar-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
 <Avatar alt="Remy Sharp" src={profile}
        sx={{ width: 30, height: 30 }}
      />      </IconButton>
     <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "avatar-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleMenuItemClick("Profile")}>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Settings")}>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Logout")}>
          <Typography variant="body2" color="error">
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
      </Box>
    </Box>
  );
};

export default Topbar;
