import logo from './logo.svg';
import './App.css';
import ChartContainer from './components/ChartContainer/ChartContainer'
import DeviceOrientation, { Orientation } from 'react-screen-orientation'

function App() {

  
  return (
    <DeviceOrientation lockOrientation={'landscape'}>
      {/* Will only be in DOM in landscape */}
      <Orientation orientation='landscape' alwaysRender={false}>
        <div>
          <ChartContainer></ChartContainer>
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
  );
}

export default App;
