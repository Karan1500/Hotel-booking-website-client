import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router,Route,Routes, BrowserRouter} from 'react-router-dom'
import Login from './screens/Login';
import Register from './screens/Register';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home" Component={Homescreen}/>
          <Route path='/book/:roomid/:fromDate/:toDate' Component={Bookingscreen}/>
          <Route path="/login" Component={Login}/>
          <Route path="/register" Component={Register}/>
          <Route path="/profile" Component={Profilescreen}/>
          <Route path="/admin" Component={Adminscreen}/>
          <Route path="/" Component={Landingscreen}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
