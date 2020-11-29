import logo from './logo.svg';
import './App.css';
import ChartContainer from './components/ChartContainer/ChartContainer'

function App() {
  document.querySelector('body').style.overflow = 'hidden';;
  return (
    <div>
      <ChartContainer></ChartContainer>
    </div>
  );
}

export default App;
