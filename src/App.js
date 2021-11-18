import React, { Suspense} from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Header from './components/Header';
import Routes from './routes/Routes';
import Login from './components/Login';
import { useSelector } from 'react-redux';

function App() {

  const employee = useSelector(state => state.employee);
  return (
    <div className="App">
      {employee.user.EmployeeId !== "" ? 
      <Suspense fallback = {<div>Loading...</div>}>
      <BrowserRouter >
      <Route render={props => (
              <div>
                  <Header {...props}/>
                  <div className="container">
                      <div className="main">
                          <Routes/>
                      </div>
                  </div>
              </div>
          )}/>
      </BrowserRouter>
    </Suspense>
    :
    <Login />}
    </div>
  );
}

export default App;
