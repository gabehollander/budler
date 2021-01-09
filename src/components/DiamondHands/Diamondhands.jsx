
import React, { useEffect, useState } from 'react';
import ChartContainer from '../ChartContainer/ChartContainer'
import CustomAppBar from '../CustomAppBar/CustomAppBar'
import About from '../About/About'
import TabPanel from '../TabPanel/TabPanel'
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import history from './history';
import firebase from './firebase';



const theme = createMuiTheme({
    overrides: {
      MuiSvgIcon: {
        root: {
          color: '#f2f2f2'
        }
      },
      MuiPickersCalendarHeader: {
        dayLabel: {
          color: '#f2f2f2'
        },
        iconButton: {
          backgroundColor: '#999999'
        }
      },
      MuiPickersDay:{
        day: {
          color: '#f2f2f2'
        },
        dayDisabled: {
          color: '#666666'
        } 
      },
      MuiPickersModal: {
        dialogRoot: {
          backgroundColor: '#1a1a1a',
          color: '#f2f2f2'
        }
      },
      MuiInputBase: {
        input: {
          color: '#f2f2f2'
        }
      },
      recharts: {
        surface: {
          height: '105%',
        }
      },

      // Style sheet name ⚛️
      MuiInputLabel: {
        // Name of the rule
        root: {
          // Some CSS
          color: '#f2f2f2',
        },
      },

    },
    palette: {
      primary: {
        main: '#ff9933'
      },
      secondary: {
        main: '#666666'
      },
      action: {
        disabledBackground: '#f2f2f2'
      }
    }
});

export default function Diamondhands(props) {

    const [tabValue, setTabValue] = useState(0);


    return (
      <Router history={ history }>
        <Switch>
          <Route path="/" children={
            <div style={{height: '100vh',width:'100vw',backgroundColor:'#000000'}}>
                <DeviceOrientation lockOrientation={'landscape'}>
                    {/* Will only be in DOM in landscape */}
                    <Orientation orientation='landscape' alwaysRender={false}>
                        <div>
                        <MuiThemeProvider theme={theme}>
                            <CustomAppBar handleTabChange={(event, newValue) => setTabValue(newValue)}></CustomAppBar>
                            <TabPanel value={tabValue} index={0}>
                                {/* <div style={{height: '100vh',width:'100vw',backgroundColor:'#000000'}}> */}
                                    <ChartContainer firebase={firebase}></ChartContainer>
                                {/* </div> */}
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <About></About>
                            </TabPanel>
                        </MuiThemeProvider>
                        </div>
                    </Orientation>
                    {/* Will stay in DOM, but is only visible in portrait */}
                    <Orientation orientation='portrait' alwaysRender={false}>
                        <div>
                        <p style={{
                            height: '100vh',
                            width: '100vw',
                            position: 'absolute',
                            textAlign: 'center',
                            top: '45%',
                            color: '#f2f2f2'
                        }}
                        >Please rotate your device</p>
                        </div>
                    </Orientation>
                </DeviceOrientation>
            </div>
          } />
        </Switch>
      </Router>
    )

}