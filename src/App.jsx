import React from 'react';
import './App.css';
import './components/sharedStyles.css';
import MidiFinder from './components/MidiFinder';
import WledFinder from './components/WledFinder';
import LocalIpInput from './components/LocalIpInput';

function App() {
  return (
    <div className="App">
      <LocalIpInput />
      <MidiFinder />
      <WledFinder />
    </div>
  );
}

export default App;
