import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import HRDashboard from './components/HRDashboard/HRDashboard';
import UserDashboard from './components/UserDashboard/UserDashboard';
import AddEmployee from './components/AddEmployee/AddEmployee';
import EmployeeDetails from './components/EmployeeDetails/EmployeeDetails';
import EmployeeList from './components/EmployeeList/EmployeeList';
import './styles/colors.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/addEmployee" element={<AddEmployee />} />
          <Route path="/edit-employee/:id" element={<AddEmployee />} />
          <Route path="/view-employees" element={<EmployeeList />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
