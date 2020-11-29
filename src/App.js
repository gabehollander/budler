import logo from './logo.svg';
import './App.css';
import ChartContainer from './components/ChartContainer/ChartContainer'

function App() {
  // const $body = document.querySelector('body');
  // let scrollPosition = 0;
  // scrollPosition = window.pageYOffset;
  // $body.style.overflow = 'hidden';
  // $body.style.position = 'fixed';
  // $body.style.top = `-${scrollPosition}px`;
  // $body.style.width = '100%';
  return (
    <div>
      <ChartContainer></ChartContainer>
    </div>
  );
}

export default App;
