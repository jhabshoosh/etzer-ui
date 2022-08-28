import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FamilyTree } from './components/FamilyTree/FamilyTree';
import { CreateNewPersonForm } from './components/FamilyTree/CreateNewPersonForm/CreateNewPersonForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <FamilyTree />
      {/* <CreateNewPersonForm /> */}
        </div>
      </header>
    </div>
  );
}

export default App;
