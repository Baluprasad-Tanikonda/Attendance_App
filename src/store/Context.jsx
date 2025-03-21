/** @format */

import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// Create Context
export const FirestoreContext = createContext();

const FirestoreProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");

  // Fetch all batches with students and full attendance history
  useEffect(() => {
    const fetchBatchesWithAttendance = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "batches"));
        const fetchedBatches = [];

        for (const batchDoc of querySnapshot.docs) {
          let batchData = { id: batchDoc.id, ...batchDoc.data() };

          if (batchData.students) {
            const studentsWithAttendance = await Promise.all(
              batchData.students.map(async (student) => {
                const studentId =
                  student.phone || student.email.replace(/\W/g, "_");

                // Fetch all attendance records
                const attendanceRef = collection(
                  db,
                  "batches",
                  batchData.id,
                  "students",
                  studentId,
                  "records"
                );

                const attendanceSnapshot = await getDocs(attendanceRef);
                const attendanceHistory = {};

                attendanceSnapshot.forEach((doc) => {
                  attendanceHistory[doc.id] = doc.data().status;
                });

                // Fetch today's attendance (update if needed)
                const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
                const todayRef = doc(attendanceRef, today);
                const todayDoc = await getDoc(todayRef);

                const todayStatus = todayDoc.exists()
                  ? todayDoc.data().status
                  : "Not Recorded";

                return {
                  ...student,
                  attendanceHistory, // Full history
                  todayStatus, // Today's attendance
                };
              })
            );

            batchData.students = studentsWithAttendance;
          }

          fetchedBatches.push(batchData);
        }

        setBatches(fetchedBatches);
        setFilteredBatches(fetchedBatches);
      } catch (error) {
        console.error("Error fetching batches with attendance:", error);
      }
    };

    fetchBatchesWithAttendance();
  }, []);

  // Function to get full attendance history for a student
  const getStudentAttendanceHistory = async (batchId, studentId) => {
    try {
      const recordsRef = collection(
        db,
        "batches",
        batchId,
        "students",
        studentId,
        "records"
      );

      const querySnapshot = await getDocs(recordsRef);
      const attendanceHistory = {};

      querySnapshot.forEach((doc) => {
        attendanceHistory[doc.id] = doc.data().status; // Store by date
      });

      return attendanceHistory;
    } catch (error) {
      console.error("Error fetching student attendance history:", error);
      return {};
    }
  };

  // Function to submit or update today's attendance
  const updateStudentAttendance = async (batchId, studentId, status) => {
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const attendanceRef = doc(
        db,
        "batches",
        batchId,
        "students",
        studentId,
        "records",
        today
      );

      await setDoc(attendanceRef, { status }, { merge: true });

      // Refresh attendance data after update
      setBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.id === batchId
            ? {
                ...batch,
                students: batch.students.map((student) =>
                  student.phone === studentId ||
                  student.email.replace(/\W/g, "_") === studentId
                    ? {
                        ...student,
                        attendanceHistory: {
                          ...student.attendanceHistory,
                          [today]: status,
                        },
                        todayStatus: status, // Update today's status
                      }
                    : student
                ),
              }
            : batch
        )
      );
    } catch (error) {
      console.error("Error updating student attendance:", error);
    }
  };

  // Filter batches based on selected course
  useEffect(() => {
    const filtered =
      filterCourse === "All"
        ? batches
        : batches.filter((batch) => batch.courseName === filterCourse);
    setFilteredBatches(filtered);
  }, [filterCourse, batches]);

  return (
    <FirestoreContext.Provider
      value={{
        batches,
        filteredBatches,
        searchTerm,
        setSearchTerm,
        filterCourse,
        setFilterCourse,
        getStudentAttendanceHistory,
        updateStudentAttendance,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreProvider;
