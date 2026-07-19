import React from 'react';
 {/* import Settings from './pages/Settings'; */} 
import './App.css';
import Carousel from './components/layout/Carousel';

function App() {
  return (
    <div className="App">
     
   {/*  <Settings /> */ } 
   <div style={{  color: 'white', padding: '20px', height: '30vh' }}>
   <Carousel />
    </div>
      
    </div>
  );
}

export default App;
