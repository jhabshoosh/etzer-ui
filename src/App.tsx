import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FamilyTree } from './components/FamilyTree/FamilyTree';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <FamilyTree />
        </div>
      </header>
    </div>
  );
}

export default App;
