import React from 'react';
import './App.css';
import './components/sharedStyles.css';
import WledFinder from './components/WledFinder';
import ControlGroups from './components/ControlGroups';
import SideNavbar from './components/SideNavbar';
// import bootstrap from 'bootstrap';

function App() {
  return (
    <div className="App">
      <div className="workspace-grid bg-gray-900">
        <SideNavbar />
        <ControlGroups />
        <WledFinder />
      </div>
    </div>
  );
}

export default App;
