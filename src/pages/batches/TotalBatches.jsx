/** @format */

import React, { useContext, useEffect, useState } from "react";
import { FirestoreContext } from "../../store/Context";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "react-feather";

const TotalBatches = () => {
  const { batches } = useContext(FirestoreContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");

  // Filter batches based on search term and selected course
  const filteredBatches = batches.filter(
    (batch) =>
      (filterCourse === "All" || batch.courseName === filterCourse) &&
      (batch.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchDate?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

   const handleAttendance = (batch) => {
     if (batch && batch.id) {
       navigate(`attendance`, {
         state: { batch },
       });
     } else {
       console.error("Batch data is missing or invalid.");
     }
   };

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      <div className="flex-1 overflow-auto bg-white shadow-xl rounded-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-700">Batches</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={() => navigate("/dashboard")}
          >
            <Plus size={18} />
            New Batch
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex justify-between items-center gap-4">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Search by name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        {/* Batch List Table */}
        {filteredBatches.length > 0 ? (
          <div className="overflow-hidden rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
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
                    <td className="px-6 py-4 text-lg text-gray-500">
                      {batch.courseName || "Unnamed Batch"}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-500">
                      {Array.isArray(batch.students)
                        ? batch.students.length
                        : 0}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-500">
                      {batch.batchDate || "Unknown Date"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => handleAttendance(batch)}
                      >
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            No batches found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBatches;
