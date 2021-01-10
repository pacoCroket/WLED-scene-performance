import React from 'react';
import './App.css';
import './components/sharedStyles.css';
import MidiFinder from './components/MidiFinder';
import WledFinder from './components/WledFinder';
import LocalIpInput from './components/LocalIpInput';
import MidiMapper from './components/MidiMapper';
import ControlGroups from './components/ControlGroups';

function App() {
  return (
    <div className="App">
      <LocalIpInput />
      <MidiFinder />
      <ControlGroups />
      <WledFinder />
    </div>
  );
}

export default App;
