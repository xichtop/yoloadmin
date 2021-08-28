import React, { Suspense} from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Header from './components/Header';
import Routes from './routes/Routes';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
