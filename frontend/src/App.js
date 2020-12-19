import React, { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

//Import Redux Store and Provider
import store from './redux/store'
import { Provider } from 'react-redux';

//React Router Dom used to create route paths for the web app
import { BrowserRouter, Route } from 'react-router-dom'

//Import Authentication
import requireAuth from './components/utils/requireAuth'
/*
requireAuth function takes 3 values, 
requireAuth(Component, Require Authentication, Hidden)
for require Auhentication true will need user to be logged in
for Hidden true will hide navigation options in Navbar
*/

//Import Main Pages
import Landing from './pages/Landing/Landing'
import UserList from './pages/UserList/UserList'
import Statistics from './pages/Statistics/Statistics'

function App() {
  return (
    <div style={{ margin: '10px' }}>
      <Provider store={store}>
        <BrowserRouter>
          <Route path='/' exact component={requireAuth(Landing, false)} />
          <Route path='/userlist' exact component={requireAuth(UserList, true, true)} />
          <Route path='/statistics' exact component={requireAuth(Statistics, true, true)} />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
