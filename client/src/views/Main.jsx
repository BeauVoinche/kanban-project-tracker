import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Main = () => {
  const [projectList, setProjectList] = useState([]);

  const isPastDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectDueDate = new Date(dueDate);
    projectDueDate.setHours(0, 0, 0, 0);

    return projectDueDate < today;
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/project`)
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const sortByDueDate = (projects) => {
    return [...projects].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    );
  };

  const backlogProjects = sortByDueDate(
    projectList.filter((project) => project.status === "backlog"),
  );

  const inProgressProjects = sortByDueDate(
    projectList.filter((project) => project.status === "in progress"),
  );

  const completedProjects = sortByDueDate(
    projectList.filter((project) => project.status === "completed"),
  );

  const updateProjectStatus = (id, status) => {
    axios
      .put(`${API_URL}/api/project/${id}`, { status })
      .then((res) => {
        const updatedProject = res.data;

        setProjectList((prevProjects) =>
          prevProjects.map((project) =>
            project._id === updatedProject._id ? updatedProject : project,
          ),
        );
      })
      .catch((err) => console.error(err));
  };

  const deleteProject = (id) => {
    axios
      .delete(`${API_URL}/api/project/${id}`)
      .then(() => {
        setProjectList((prevProjects) =>
          prevProjects.filter((project) => project._id !== id),
        );
      })
      .catch((err) => console.error(err));
  };

  const renderProjectCard = (project, buttonText, buttonClass, onClick) => (
    <div className="border border-dark p-2 mb-2" key={project._id}>
      <h5>{project.name}</h5>

      <p style={{ color: isPastDue(project.dueDate) ? "red" : "black" }}>
        Due: {new Date(project.dueDate).toLocaleDateString("en-US")}
      </p>

      <button className={`btn ${buttonClass}`} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <Link to="/project/create" className="btn btn-primary">
          Add New Project
        </Link>
      </div>

      <table className="table table-bordered border-dark">
        <thead>
          <tr>
            <th scope="col" className="table-primary border border-dark">
              Backlog
            </th>
            <th scope="col" className="table-warning border border-dark">
              In Progress
            </th>
            <th scope="col" className="table-success border border-dark">
              Completed
            </th>
          </tr>
        </thead>

        <tbody className="table-group-divider">
          <tr>
            <td className="overflow-y-auto">
              {backlogProjects.map((project) =>
                renderProjectCard(project, "Start Project", "btn-warning", () =>
                  updateProjectStatus(project._id, "in progress"),
                ),
              )}
            </td>

            <td className="overflow-y-auto">
              {inProgressProjects.map((project) =>
                renderProjectCard(
                  project,
                  "Move to Completed",
                  "btn-success",
                  () => updateProjectStatus(project._id, "completed"),
                ),
              )}
            </td>

            <td className="overflow-y-auto">
              {completedProjects.map((project) =>
                renderProjectCard(project, "Remove Project", "btn-danger", () =>
                  deleteProject(project._id),
                ),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Main;
