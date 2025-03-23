/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import Loader from "./../../components/Layout/Loader";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [batchName, setBatchName] = useState("");
  const [batchDate, setBatchDate] = useState("");
  const [courseName, setCourseName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceLink, setAttendanceLink] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const courseOptions = [
    "React Development",
    "Full Stack Development",
    "Data Science",
    "UI/UX Design",
    "AWS DevOps",
  ];

  const isValidPhoneNumber = (phone) => /^[6789]\d{9}$/.test(phone);

  const handleAddStudent = () => {
    if (!studentName || !studentEmail || !isValidPhoneNumber(studentPhone)) {
      window.alert(
        "Please enter valid details (including a 10-digit phone number)."
      );
      return;
    }

    const isDuplicate = students.some(
      (student) =>
        student.email === studentEmail || student.phone === studentPhone
    );

    if (isDuplicate) {
      window.alert("A student with this email or phone number already exists.");
      return;
    }

    setStudents([
      ...students,
      { name: studentName, email: studentEmail, phone: studentPhone },
    ]);

    setStudentName("");
    setStudentEmail("");
    setStudentPhone("");
  };

  const handleSubmitForm = async () => {
    if (batchName && batchDate && courseName && students.length > 0) {
      const batchData = { batchName, batchDate, courseName, students };

      try {
        const docRef = await addDoc(collection(db, "batches"), batchData);
        const generatedLink = `/attendanceForm/${docRef.id}`;

        await updateDoc(doc(db, "batches", docRef.id), {
          attendanceLink: generatedLink,
        });

        setAttendanceLink(generatedLink);
        window.alert("Batch successfully created with an attendance link!");
      } catch (error) {
        console.error("Error adding document: ", error);
        window.alert("Error adding batch. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create Batch</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Batch Name"
            className="w-full p-2 border rounded-md"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={batchDate}
            onChange={(e) => setBatchDate(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded-md"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          >
            <option value="">Select Course</option>
            {courseOptions.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-semibold text-gray-800">Add Student</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            className="w-full p-2 border rounded-md"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Student Email"
            className="w-full p-2 border rounded-md"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Student Phone"
            className="w-full p-2 border rounded-md"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            onClick={handleAddStudent}
          >
            Add Student
          </button>
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded-md"
          onClick={handleSubmitForm}
        >
          Submit Form
        </button>
      </div>

      <div className="md:w-1/2 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Submitted Content
        </h2>
        {attendanceLink && (
          <div className="p-4 bg-gray-100 rounded-md">
            <h4 className="text-lg font-semibold">Attendance Link</h4>

            <p>
              <a
                href={attendanceLink}
                className="text-blue-600 hover:underline"
              >
                {window.location.origin + attendanceLink}
              </a>
            </p>
          </div>
        )}
        {batchName && batchDate && courseName && students.length > 0 && (
          <div className="p-4 bg-gray-100 rounded-md">
            <h4 className="text-lg font-semibold">Batch Details</h4>
            <p className="text-gray-600">Batch Name: {batchName}</p>
            <p className="text-gray-600">Batch Date: {batchDate}</p>
            <p className="text-gray-600">Course Name: {courseName}</p>
            <h4 className="text-lg font-semibold mt-4">Students Added</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {students.map((student, index) => (
                <li key={index}>
                  {student.name} - {student.email} - {student.phone}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
