import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Paper, styled, IconButton, Typography, Toolbar, AppBar, ListItemText, ListItemIcon, ListItemButton, ListItem, Divider, Card, Box, Drawer, List, FormControl, InputLabel, Input, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import DonutChartPurchaseOrder from '../components/DonutChartPurchaseOrder';
import TableShow from '../components/TableShow';
import Swal from 'sweetalert2';
import api from '../service/api';
import { Password } from '@mui/icons-material';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isLogged, setIsLogged] = useState(false);
  const [roleUser, setRoleUser] = useState('');
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);

  const getuser = () => {
    Swal.fire({
      title: 'Login',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        api.post(`auth/authenticate`,
          {
            "userName": document.getElementById('swal-input1').value,
            "password": document.getElementById('swal-input2').value
          })
          .then((response) => {
            sessionStorage.setItem('session_user', JSON.stringify(response.data));
            const user = JSON.parse(sessionStorage.getItem('session_user'));
            sessionStorage.setItem('token_session_user', user.token);
            if (user) {
              setIsLogged(true);
              setRoleUser(user.user.role);
            }

          })
          .catch((error) => {
            console.log(`Ocorreu um erro ao tentar buscar usuário: ${error}`);
            Swal.fire({
              icon: 'error',
              title: 'Login Fail',
              text: 'ADM login requerid'
            })
          });
      }
    })
  }

  const login = () => {
    getuser();
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    sessionStorage.clear();
    getuser();
  }, []);

  // const createColor = () => {
  //   return window.crypto.getRandomValues(new Uint8Array(3))
  //     .reduce((acc, val) => acc + val.toString(16), "#");
  // }

  const createColor = () => {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let color = rgbToHex(r, g, b);
    return color;
  }

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const setTotal = (value) => {
    const token = sessionStorage.getItem('token_session_user');
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;
    let d4 = 0;
    let arr = [];

    api.get(`/purchaseorder?skip=0&take=${value}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (Array.isArray(response.data)) {
          response.data.forEach((element, index) => {
            switch (response.data[index].deliveryTeamName) {
              case 'DeliveryTeam 1':
                d1++;
                break;
              case 'DeliveryTeam 2':
                d2++;
                break;
              case 'DeliveryTeam 3':
                d3++;
                break;
              case 'DeliveryTeam 4':
                d4++;
                break;
              default:
                break;
            }
            arr.push(
              {
                label: element.deliveryTeamName,
                value: 0,
                color: ''
              });
          });
        }

        const deliveryTeams = arr.filter(function (a) {
          return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
        }, Object.create(null));

        let color = [];
        deliveryTeams.forEach((element, index) => {
          let clr = createColor();
          color.push(clr);
          deliveryTeams[index].color = clr;
          deliveryTeams[index].value = deliveryTeams[index].label === 'DeliveryTeam 1'
            ? d1 : deliveryTeams[index].label === 'DeliveryTeam 2'
              ? d2 : deliveryTeams[index].label === 'DeliveryTeam 3'
                ? d3 : d4;
        });

        setColors(color);
        setData(deliveryTeams);
      })
      .catch((error) => {
        console.log(`Ocorreu um erro ao tentar buscar lista de pedidos: ${error}`);
      });
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer('left', true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard E-commerce
          </Typography>
          <Button color="inherit" onClick={login}>Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer('left', false)}
          onKeyDown={toggleDrawer('left', false)}
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {isLogged && roleUser === 'manager' ? (


        <Grid container spacing={1} mb={1} mt={0} paddingLeft={1} paddingRight={1} justifyContent="center">
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
          <Item>xs=1</Item>
        </Grid> */}
          <Grid item xs={12}>
            <TableShow totalOrdersCallBack={setTotal} />
          </Grid>
          <Grid item xs={12}>
            <DonutChartPurchaseOrder data={data} colors={colors} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1} mb={1} mt={0} paddingLeft={1} paddingRight={1} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User not logged in or with insufficient permissions
            </Typography>
          </Grid>
        </Grid>
      )
      }

    </>
  );
}
