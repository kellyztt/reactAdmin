import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/login';
import Admin from './pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Switch> {/**Only compare to one */}
        <Route path='/login' component={ Login } />
        <Route path='/' component={ Admin } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
