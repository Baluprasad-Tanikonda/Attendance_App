/** @format 
complete attendance page */

import React, { useContext } from "react";
import Calendar from "react-calendar";
import { useLocation } from "react-router-dom";
import { FirestoreContext } from "../../store/Context";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import calenderStyle from "./calenderStyle.module.css";

const StudentAttendance = () => {
  const location = useLocation();
  const { studentId } = location.state || {};
  const { batches } = useContext(FirestoreContext);

  if (!studentId) {
    return (
      <div className="p-6 text-center text-gray-600">No student selected.</div>
    );
  }

  // Find the batch that contains this student
  let student = null;
  let studentBatch = null;

  for (const batch of batches) {
    const foundStudent = batch.students?.find(
      (s) => s.phone === studentId || s.email.replace(/\W/g, "_") === studentId
    );

    if (foundStudent) {
      student = foundStudent;
      studentBatch = batch;
      break;
    }
  }

  if (!student || !studentBatch) {
    return (
      <div className="p-6 text-center text-gray-600">
        Student data not found.
      </div>
    );
  }

  // Attendance calculations
  const attendanceHistory = student.attendanceHistory || {};
  const totalClasses = Object.keys(attendanceHistory).length;
  const presentCount = Object.values(attendanceHistory).filter(
    (status) => status === "Present"
  ).length;
  const absentCount = Object.values(attendanceHistory).filter(
    (status) => status === "Absent"
  ).length;
  const leaveCount = Object.values(attendanceHistory).filter(
    (status) => status === "Leave"
  ).length;
  const attendancePercentage =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  // Function to apply custom styles to calendar dates
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Only apply styles in month view

    const formattedDate = format(date, "yyyy-MM-dd");

    if (attendanceHistory[formattedDate] === "Present") {
      return calenderStyle.present_day; // Custom class for present
    } else if (attendanceHistory[formattedDate] === "Absent") {
      return calenderStyle.absent_day; // Custom class for absent
    } else if (attendanceHistory[formattedDate] === "Leave") {
      return calenderStyle.leave_day; // Custom class for leave
    }

    return "";
  };

  return (

    <>

    
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Student Information */}
      <div className="p-6 bg-white rounded-md shadow-md mb-6">
        <h2 className="text-xl font-bold flex items-center space-x-3">
          <span className="bg-gray-300 text-gray-800 px-3 py-2 rounded-full">
            {student.name.charAt(0)}
          </span>
          <span>{student.name}</span>
        </h2>
        <p className="text-gray-600">
          {studentBatch.batchName} | ID: {studentId}
        </p>
        <p className="text-gray-600">
          <strong>Email:</strong> {student.email}
        </p>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-gray-600">Total Classes</p>
          <h2 className="text-xl font-bold">{totalClasses}</h2>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-gray-600">Average Attendance</p>
          <h2
            className={`text-xl font-bold ${
              attendancePercentage >= 70 ? "text-green-600" : "text-red-600"
            }`}
          >
            {attendancePercentage}%
          </h2>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-gray-600">Present Days</p>
          <h2 className="text-xl font-bold">{presentCount}</h2>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md">
          <p className="text-red-600">Absent Days</p>
          <h2 className="text-xl font-bold text-red-600">{absentCount}</h2>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
        {/* Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Attendance Overview */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-md flex flex-col h-full">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Attendance Overview
            </h3>
            <div className="grid grid-cols-2 gap-6 items-center flex-grow">
              {/* Attendance Chart */}
              <div className="relative flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-green-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {attendancePercentage}%
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    ✔ Present
                  </span>
                  <span className="text-gray-700">
                    {presentCount} days - {attendancePercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-medium flex items-center gap-2">
                    ✖ Absent
                  </span>
                  <span className="text-gray-700">
                    {absentCount} days -{" "}
                    {((absentCount / totalClasses) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-medium flex items-center gap-2">
                    🔶 Leave
                  </span>
                  <span className="text-gray-700">
                    {leaveCount} days -{" "}
                    {((leaveCount / totalClasses) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-md flex flex-col items-center h-full">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Attendance Calendar
            </h3>
            <div className="w-full flex-grow flex items-center justify-center">
              <Calendar
                tileClassName={tileClassName}
                className="w-full shadow-md rounded-md border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default StudentAttendance;
