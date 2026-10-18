import { useState } from "react";
import ResourceManager from "./ResourceManager.jsx";

const studentFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "courseId", label: "Course", type: "select", source: "courses", labelKey: "title", required: true },
];

const courseFields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "duration", label: "Duration (weeks)", type: "number", required: true },
];

export default function App() {
  const [tab, setTab] = useState("students");

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1>Student & Course Manager</h1>
        </div>
      </header>
      <main className="container py-4">
        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button className={`nav-link ${tab === "students" ? "active" : ""}`} onClick={() => setTab("students")}>Students</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab === "courses" ? "active" : ""}`} onClick={() => setTab("courses")}>Courses</button>
          </li>
        </ul>
        {tab === "students" ? (
          <ResourceManager key="students" resource="students" label="Student" fields={studentFields} />
        ) : (
          <ResourceManager key="courses" resource="courses" label="Course" fields={courseFields} />
        )}
      </main>
    </>
  );
}
