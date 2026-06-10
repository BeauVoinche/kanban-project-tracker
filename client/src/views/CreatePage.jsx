import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CreatePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errList, setErrList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/api/project`, { name, dueDate })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        const errors = err.response?.data?.errors || {};
        const errorMessages = Object.values(errors).map(
          (error) => error.message,
        );

        setErrList(errorMessages);
      });
  };

  return (
    <div>
      <Link to="/">Back to Dashboard</Link>

      <div className="border border-dark p-3 mt-3">
        <legend>Plan a new project:</legend>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="projectName" className="form-label">
              Project:
            </label>

            <input
              type="text"
              className="form-control"
              id="projectName"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="projectDueDate" className="form-label">
              Due Date:
            </label>

            <input
              type="date"
              className="form-control"
              id="projectDueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {errList.map((errorMessage, index) => (
            <p style={{ color: "red" }} key={index}>
              {errorMessage}
            </p>
          ))}

          <button type="submit" className="btn btn-primary">
            Plan Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
