/** @format */
import React, { useState, useEffect, useContext } from "react";
import { FirestoreContext } from "../../store/Context";

const BatchPerformance = ({ selectedBatchId }) => {
  const { batches } = useContext(FirestoreContext);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [perfectAttendance, setPerfectAttendance] = useState(0);
  const [below70, setBelow70] = useState(0);
  const [calculatedTotalClasses, setCalculatedTotalClasses] = useState(0);

  useEffect(() => {
    if (!selectedBatchId) return;

    const batch = batches.find((b) => b.id === selectedBatchId);
    if (!batch || !batch.students) return;

    setSelectedBatch(batch);

    // Step 1: Calculate Total Classes Dynamically
    let uniqueDates = new Set();

    batch.students.forEach((student) => {
      Object.entries(student.attendanceHistory || {}).forEach(
        ([date, status]) => {
          if (status === "Present") uniqueDates.add(date);
        }
      );
    });

    const totalClasses = uniqueDates.size; // Count of unique "Present" dates
    setCalculatedTotalClasses(totalClasses);

    if (totalClasses === 0) return; // Avoid division by zero

    // Step 2: Calculate Attendance Metrics
    let totalAttendance = 0;
    let perfectCount = 0;
    let below70Count = 0;

    batch.students.forEach((student) => {
      const attendedClasses = Object.values(
        student.attendanceHistory || {}
      ).filter((status) => status === "Present").length;

      const attendancePercentage = (attendedClasses / totalClasses) * 100;

      totalAttendance += attendancePercentage;
      if (attendancePercentage === 100) perfectCount++;
      if (attendancePercentage < 70) below70Count++;
    });

    setAvgAttendance((totalAttendance / batch.students.length).toFixed(2));
    setPerfectAttendance(perfectCount);
    setBelow70(below70Count);
  }, [selectedBatchId, batches]);

  if (!selectedBatch) return <p>Loading batch data...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Batch Performance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Classes</h2>
          <p className="text-gray-600">{calculatedTotalClasses || "N/A"}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Average Attendance</h2>
          <p className="text-green-600">{avgAttendance}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Perfect Attendance</h2>
          <p>{perfectAttendance} students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Attendance Below 70%</h2>
          <p className="text-red-600">{below70} students</p>
        </div>
      </div>
    </div>
  );
};

export default BatchPerformance;
