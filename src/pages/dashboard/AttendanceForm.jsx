/** @format */
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FirestoreContext } from "../../store/Context"; // Import context

const AttendanceForm = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { filteredBatches, updateStudentAttendance } =
    useContext(FirestoreContext);

  const [attendance, setAttendance] = useState({});
  const [batchData, setBatchData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const storageKey = `attendance_${batchId}_${
    today.toISOString().split("T")[0]
  }`;

  useEffect(() => {
    if (!batchId) return;

    const batch = filteredBatches.find((batch) => batch.id === batchId);
    if (batch) {
      setBatchData(batch);

      const storedAttendance =
        JSON.parse(localStorage.getItem(storageKey)) || {};
      setAttendance(storedAttendance);

      if (Object.keys(storedAttendance).length > 0) {
        setSubmitted(true);
      }
    }
  }, [batchId, filteredBatches]);

  const handleAttendanceChange = (id) => {
    if (submitted) return;
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!batchData) return alert("Batch not found!");
    if (submitted) return alert("Attendance already submitted for today!");

    try {
      await Promise.all(
        Object.entries(attendance).map(([studentId, status]) =>
          updateStudentAttendance(batchId, studentId, status)
        )
      );

      localStorage.setItem(storageKey, JSON.stringify(attendance));

      alert("Attendance saved successfully!");
      setSubmitted(true);
      navigate(-1);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  if (!batchData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">
        Mark Attendance - Batch Name: {batchData.batchName}
      </h1>
      <p className="text-lg text-gray-700 mb-4">Date: {formattedDate}</p>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Present</th>
            </tr>
          </thead>
          <tbody>
            {batchData.students.map((student, index) => {
              const studentId =
                student.phone || student.email.replace(/\W/g, "_");
              return (
                <tr key={studentId} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.email}</td>
                  <td className="p-2">{student.phone || "N/A"}</td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={attendance[studentId] === "Present"}
                      onChange={() => handleAttendanceChange(studentId)}
                      disabled={submitted}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleSubmitAttendance}
          disabled={submitted}
        >
          Submit Attendance
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;
