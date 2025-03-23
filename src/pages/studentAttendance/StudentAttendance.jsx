/** @format */

import React, { useContext, useRef, useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import { FirestoreContext } from "../../store/Context";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import calenderStyle from "./calenderStyle.module.css";

const StudentAttendance = () => {
  const location = useLocation();
  const { studentId } = location.state || {};
  const { batches } = useContext(FirestoreContext);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState({});
  const [studentBatch, setStudentBatch] = useState(null);

  const navigate = useNavigate();
  const { filteredBatches, filterCourse, setFilterCourse } =
    useContext(FirestoreContext);

  const [batchSearchTerm, setBatchSearchTerm] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const batchDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);

  const courseOptions = [
    ...new Set(filteredBatches.map((batch) => batch.courseName)),
  ];

  const batchOptions =
    filterCourse !== ""
      ? [
          ...new Set(
            filteredBatches
              .filter((batch) => batch.courseName === filterCourse)
              .map((batch) => batch.batchName)
          ),
        ]
      : [];

  const studentOptions =
    selectedBatch !== ""
      ? filteredBatches
          .filter((batch) => batch.batchName === selectedBatch)
          .flatMap((batch) => batch.students)
      : [];

  const filteredBatchesList = batchOptions.filter((batch) =>
    batch.toLowerCase().includes(batchSearchTerm.toLowerCase())
  );

  const filteredStudentsList = studentOptions.filter((student) =>
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const toggleBatchDropdown = () =>
    setIsBatchDropdownOpen(!isBatchDropdownOpen);
  const toggleStudentDropdown = () =>
    setIsStudentDropdownOpen(!isStudentDropdownOpen);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setIsBatchDropdownOpen(false);
    setBatchSearchTerm("");
    setSelectedStudent(null); // Reset selected student when batch changes
    setAttendanceHistory({}); // Reset attendance history
    setStudentBatch(batches.find((b) => b.batchName === batch)); // Set the current batch
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setIsStudentDropdownOpen(false);
    setStudentSearchTerm("");
    setAttendanceHistory(student.attendanceHistory || {});
  };

  // Find the student based on studentId when the component mounts
  useEffect(() => {
    if (studentId) {
      for (const batch of batches) {
        const foundStudent = batch.students?.find(
          (s) =>
            s.phone === studentId || s.email.replace(/\W/g, "_") === studentId
        );

        if (foundStudent) {
          setSelectedStudent(foundStudent);
          setStudentBatch(batch);
          setAttendanceHistory(foundStudent.attendanceHistory || {});
          setSelectedBatch(batch.batchName); // Set the batch name
          break;
        }
      }
    }
  }, [studentId, batches]);

  // Attendance calculations
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Student Information */}
      <div className="bg-gray-100 text-center">
        <h1 className="text-2xl font-bold mb-4">Select a Student</h1>
        <p className="text-gray-600 mb-6">
          First, select a course to see the available batches.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            className="p-2 border rounded-md w-60"
            value={filterCourse}
            onChange={(e) => {
              setFilterCourse(e.target.value);
              setSelectedBatch("");
              setSelectedStudent(null);
              setAttendanceHistory({});
            }}
          >
            <option value="">Select Course</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Batch Selection */}
          <div className="relative w-64" ref={batchDropdownRef}>
            <button
              onClick={toggleBatchDropdown}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{selectedBatch || "Select Batch"}</span>
            </button>
            {isBatchDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search Batch..."
                    value={batchSearchTerm}
                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    autoFocus
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                  {filteredBatchesList.length > 0 ? (
                    filteredBatchesList.map((batch, index) => (
                      <li
                        key={index}
                        onClick={() => handleBatchSelect(batch)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {batch}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Student Selection */}
          <div className="relative w-64" ref={studentDropdownRef}>
            <button
              onClick={toggleStudentDropdown}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedBatch}
            >
              <span>
                {selectedStudent ? selectedStudent.name : "Select Student"}
              </span>
            </button>
            {isStudentDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search Student..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    autoFocus
                  />
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                  {filteredStudentsList.length > 0 ? (
                    filteredStudentsList.map((student, index) => (
                      <li
                        key={index}
                        onClick={() => handleStudentSelect(student)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {student.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div>
          <div className="p-6 bg-white rounded-md shadow-md mb-6">
            <h2 className="text-xl font-bold flex items-center space-x-3">
              <span className="bg-gray-300 text-gray-800 px-3 py-2 rounded-full">
                {selectedStudent.name.charAt(0)}
              </span>
              <span>{selectedStudent.name}</span>
            </h2>
            <p className="text-lg text-gray-600">
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p className="text-xl font-semibold text-gray-600 py-1 rounded-md inline-block">
              Batch Name: {studentBatch.batchName}
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
      )}
    </div>
  );
};

export default StudentAttendance;
