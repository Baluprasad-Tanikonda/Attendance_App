/** @format */
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FirestoreContext } from "../../store/Context";
import BatchPerformance from './BatchPerformance';

const BatchAttendance = () => {
  const location = useLocation();
  const { filteredBatches } = useContext(FirestoreContext);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-01");
  const navigate = useNavigate();

   useEffect(() => {
     if (location.state && location.state.batch) {
       setSelectedBatch(location.state.batch);
     }
   }, [location.state]);
   
  // If coming from batch selection, use it; otherwise, fetch all batches
  useEffect(() => {
    if (location.state && location.state.batch) {
      setSelectedBatch(location.state.batch);
    }
  }, [location.state]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const handleBack = () => {
    setSelectedBatch(null);
  };

  // If no batch is selected, display the list of batches
  if (!selectedBatch) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Select a Batch</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                <span className="text-2xl text-indigo-600">Batch Name: </span>{" "}
                {batch.batchName || "Unnamed Batch"}
              </h2>
              <p className="text-gray-600">
                Course: <span className="font-medium">{batch.courseName}</span>
              </p>
              <p className="text-gray-600">
                Students:{" "}
                <span className="font-medium">
                  {batch.students?.length || 0}
                </span>
              </p>
              <button
                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleBatchSelect(batch)}
              >
                Check Attendance
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If a batch is selected, display its details
  const avgAttendance = selectedBatch.avgAttendance?.[selectedMonth] || "N/A";
  const perfectAttendance =
    selectedBatch.perfectAttendance?.[selectedMonth] || "N/A";
  const below70 = selectedBatch.below70?.[selectedMonth] || "N/A";
  const getLastFiveDates = () => {
    const dates = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const lastFiveDates = getLastFiveDates();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Batch Attendance</h1>

      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={handleBack}
      >
        Back
      </button>

      {/* Month Selector */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Integrated BatchPerformance Component */}
      <BatchPerformance selectedBatchId={selectedBatch.id} />

      {/* Students List */}
      <div className="p-6 bg-gray-100">
        {/* Students Attendance Table */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Students List</h2>

          {selectedBatch.students && selectedBatch.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg">
                {/* Table Head */}
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    {lastFiveDates.map((date, index) => (
                      <th key={index} className="p-3 text-sm">
                        {date}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {selectedBatch.students.map((student, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td
                        className="p-3 font-semibold text-blue-600 cursor-pointer hover:underline"
                        onClick={() => {
                          const studentId =
                            student.phone || student.email.replace(/\W/g, "_");
                          console.log("Navigating with studentId:", studentId);
                          navigate("/attendance", {
                            state: {
                              activeTab: "Student Attendance",
                              studentId: studentId,
                            },
                          });
                        }}
                      >
                        {student.name}
                      </td>

                      <td className="p-3">{student.email}</td>

                      {/** Get attendance from `attendanceHistory` for the last 5 dates */}
                      {lastFiveDates.map((date, i) => (
                        <td key={i} className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              student.attendanceHistory?.[date] === "Present"
                                ? // ? "bg-green-300 text-green-800"
                                  // : student.attendanceHistory?.[date] === "Absent"
                                  // ? "bg-red-300 text-red-800"
                                  // : "bg-gray-300 text-gray-700"
                                  "bg-green-300 text-green-800"
                                : "bg-red-300 text-red-800"
                              // : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {student.attendanceHistory?.[date] === "Present"
                              ? "Present"
                              : "Absent"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No students available for this batch.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchAttendance;
