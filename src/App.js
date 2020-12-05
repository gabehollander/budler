import logo from './logo.svg';
import './App.css';
import ChartContainer from './components/ChartContainer/ChartContainer'
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
    }
  }
});

function App() {

  
  return (
    <div style={{height: '100vh',width:'100vw',backgroundColor:'#000000'}}>
      <DeviceOrientation lockOrientation={'landscape'}>
        {/* Will only be in DOM in landscape */}
        <Orientation orientation='landscape' alwaysRender={false}>
          <div>
            <MuiThemeProvider theme={theme}>
              <ChartContainer></ChartContainer>
            </MuiThemeProvider>
          </div>
        </Orientation>
        {/* Will stay in DOM, but is only visible in portrait */}
        <Orientation orientation='portrait' alwaysRender={false}>
          <div>
            <p style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              textAlign: 'center',
              top: '45%'
            }}
            >Please rotate your device</p>
          </div>
        </Orientation>
      </DeviceOrientation>
    </div>
  );
}

export default App;
