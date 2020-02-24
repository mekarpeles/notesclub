import * as React from 'react';
import './App.css';
import Exercise from './Exercise';
import Header from './Header';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
      <Exercise />
      </div>

    );
  }
}

export default App;
