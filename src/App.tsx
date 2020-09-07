import React from 'react';
import './App.css';
import { Header } from './Components/Header/Header';
import { MapRouting } from './Components/Content/MapRouting';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MapRouting />
    </div>
  );
}

export default App;
