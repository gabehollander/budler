import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

const theme = createMuiTheme({
    overrides: {

      MuiTabs: {
          root: {
              minHeight: 'unset',
          },
          flexContainer: {
              height: '100%',
          }
      },
      MuiTab: {
          root: {
              minHeight: 'unset',
              alignSelf: 'center',
          }
      }
    },
    palette: {
      primary: {
        main: '#ff9933'
      },
      secondary: {
        main: '#666666'
      }
    }
});

export default function CustomAppBar(props) {

    const useStyles = makeStyles(theme => ({
        appBarOpen:{
            alignItems: 'flex-end',
            height: '8vh',
            color: '#f2f2f2',
            backgroundColor: '#262626',
            position: 'fixed',
            top: '0',
            transition: 'top .5s',
            width: '100vw',
        },
        appBarClosed:{
            top: '-10%',
        },
        appBarToggle:{
            height: '18vh',
            backgroundColor: '#262626',
            width: '10%',
            position: 'absolute',
            right: '0',
            borderRadius: '8px',
            clipPath: 'inset(8vh -5px -5px -5px)',
            display: 'flex',
        },
        toggleIcon:{
            margin: 'auto',
            marginBottom: '5%',
            color: '#f2f2f2'
        }
    }))

    const classes = useStyles();

    const [barOpen, setBarOpen] = useState(false);

    const handleBarToggle = () => {
        setBarOpen(!barOpen)
    }

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <MuiThemeProvider theme={theme}>
            <AppBar className={`${classes.appBarOpen} ${barOpen ? '' : classes.appBarClosed}`} position="static">
                <Tabs value={props.tabValue} onChange={props.handleTabChange} aria-label="simple tabs example">
                    <Tab label="Chart"  {...a11yProps(0)} />
                    <Tab label="About" {...a11yProps(1)} />
                </Tabs>
                <Paper
                    elevation={4}
                    onClick={handleBarToggle}
                    className={classes.appBarToggle}
                >
                    {barOpen ? <TrendingUpIcon className={classes.toggleIcon} /> : <TrendingDownIcon className={classes.toggleIcon} />}
                </Paper>
            </AppBar>
        </MuiThemeProvider>

    )

}