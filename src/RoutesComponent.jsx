import React from 'react';
import { Routes, Route } from "react-router-dom";
import TotalBatches from "./pages/batches/TotalBatches";
import Dashboard from "./pages/dashboard/Dashboard";
import AttendancePage from "./pages/AttendancePage/AttendancePage";
import PageLayout from './components/Layout/PageLayout';
import AttendanceForm from './pages/dashboard/AttendanceForm';

const RoutesComponent = () => {
    return (
      <Routes>
        {/* Wrap routes inside PageLayout */}
        <Route path="/" element={<PageLayout />}>
          <Route index element={<TotalBatches />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path='/attendanceForm/:batchId' element={<AttendanceForm/>} />
        </Route>
      </Routes>
    );
};

export default RoutesComponent;