/** @format */

import React, { useContext, useEffect, useState, Suspense } from "react";
import { FirestoreContext } from "../../store/Context";
import { useNavigate } from "react-router-dom";
import { Plus } from "react-feather";
import Loader from "../../components/Layout/Loader";

const TotalBatches = () => {
  const { batches } = useContext(FirestoreContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredBatches = batches.filter(
    (batch) =>
      (filterCourse === "All" || batch.courseName === filterCourse) &&
      (batch.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchDate?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAttendance = (batch) => {
    if (batch && batch.id) {
      navigate(`attendance`, { state: { batch } });
    } else {
      console.error("Batch data is missing or invalid.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="flex-1 overflow-auto bg-white shadow-xl rounded-lg p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Batches
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={() => navigate("/dashboard")}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Batch</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg py-2 px-4 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="All">All Courses</option>
              {[
                ...new Set(
                  batches.map((batch) => batch.courseName).filter(Boolean)
                ),
              ].map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search by course or date..."
              className="w-full border border-gray-300 rounded-lg py-2 px-4 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Batches List */}
        <Suspense fallback={<Loader />}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Loader />
            </div>
          ) : filteredBatches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Course Name
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Students
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Start Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="cursor-pointer hover:bg-gray-100 transition"
                    >
                      <td className="px-4 md:px-6 py-4 text-sm md:text-lg text-gray-500">
                        {batch.courseName || "Unnamed Batch"}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-lg text-gray-500">
                        {Array.isArray(batch.students)
                          ? batch.students.length
                          : 0}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-lg text-gray-500">
                        {batch.batchDate || "Unknown Date"}
                      </td>
                      <td className="px-4 md:px-6 py-4 flex flex-col md:flex-row gap-2 md:gap-4">
                        <button
                          className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
                          onClick={() => handleAttendance(batch)}
                        >
                          View Attendance
                        </button>
                        <button
                          className="px-3 md:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm md:text-base"
                          onClick={() =>
                            navigate(`/attendanceForm/${batch.id}`, {
                              state: { students: batch.students },
                            })
                          }
                        >
                          Get Link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Loader />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default TotalBatches;
