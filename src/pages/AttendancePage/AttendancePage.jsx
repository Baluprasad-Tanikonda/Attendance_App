/** @format */

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BatchAttendance from "../batchAttendance/BatchAttendance";
import StudentAttendance from "../studentAttendance/StudentAttendance";
import Loader from "../../components/Layout/Loader"; // Import your Loader component

const AttendancePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Batch Attendance");
  const [loading, setLoading] = useState(true);
  const batch = location.state?.batch || null;
  const student = location.state?.student || null;

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    // Show loader for at least 1 second
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 flex space-x-6 mb-6">
        <button
          className={`pb-2 font-semibold ${
            activeTab === "Batch Attendance"
              ? "border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Batch Attendance")}
        >
          Batch Attendance
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "Student Attendance"
              ? "border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Student Attendance")}
        >
          Student Attendance
        </button>
      </div>

      {/* Show Loader for 1 Second */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          {activeTab === "Batch Attendance" && (
            <BatchAttendance batch={batch} />
          )}
          {activeTab === "Student Attendance" && (
            <StudentAttendance student={student} />
          )}
        </>
      )}
    </div>
  );
};

export default AttendancePage;
