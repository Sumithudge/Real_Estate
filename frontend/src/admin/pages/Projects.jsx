import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
  });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 10,
      };

      if (searchRef.current.trim()) {
        params.search = searchRef.current.trim();
      }

      if (status) {
        params.status = status;
      }

      const response = await api.get("/projects", {
        params,
      });

      const data = response.data;

      // Backend may return array directly
      if (Array.isArray(data)) {
        setProjects(data);

        setPagination({
          currentPage: page,
          totalPages: 1,
          totalProjects: data.length,
        });

        return;
      }

      // Backend pagination response
      setProjects(data.projects || []);

      setPagination({
        currentPage:
          data.currentPage ||
          data.page ||
          page,

        totalPages:
          data.totalPages ||
          1,

        totalProjects:
          data.totalProjects ||
          data.total ||
          data.count ||
          data.projects?.length ||
          0,
      });
    } catch (err) {
      console.error(
        "Fetch projects error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProjects, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchProjects]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    fetchProjects();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/projects/${id}`
      );

      fetchProjects();
    } catch (err) {
      console.error(
        "Delete project error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  const getProjectName = (project) => {
    return (
      project.name ||
      project.title ||
      project.projectName ||
      "Untitled Project"
    );
  };

  const getBuilderName = (project) => {
    if (!project.builder) {
      return "—";
    }

    if (
      typeof project.builder === "string"
    ) {
      return project.builder;
    }

    return (
      project.builder.name ||
      project.builder.builderName ||
      "—"
    );
  };

  const getLocalityName = (project) => {
    if (!project.locality) {
      return "—";
    }

    if (
      typeof project.locality === "string"
    ) {
      return project.locality;
    }

    return (
      project.locality.name ||
      project.locality.localityName ||
      "—"
    );
  };

  const getStatusClass = (value) => {
    if (!value) {
      return "status-default";
    }

    const normalized =
      value.toLowerCase();

    if (
      normalized === "active" ||
      normalized === "available" ||
      normalized === "ongoing"
    ) {
      return "status-active";
    }

    if (
      normalized === "completed" ||
      normalized === "sold"
    ) {
      return "status-completed";
    }

    if (
      normalized === "upcoming" ||
      normalized === "pre-launch"
    ) {
      return "status-upcoming";
    }

    return "status-default";
  };

  return (
    <div className="admin-page projects-page">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <h1>Projects</h1>

          <p>
            Manage all Pune real estate projects.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="btn btn-primary"
        >
          + Add Project
        </Link>

      </div>

      {/* FILTERS */}
      <div className="admin-panel projects-filters">

        <form
          onSubmit={handleSearch}
          className="project-search-form"
        >

          <div className="search-field">

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>

          </div>

        </form>

        <div className="filter-field">

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >

            <option value="">
              All Status
            </option>

            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Ongoing">
              Ongoing
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Sold">
              Sold
            </option>

          </select>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="admin-panel">

        <div className="panel-header">

          <div>

            <h2>
              All Projects
            </h2>

            <span className="panel-count">
              {pagination.totalProjects} projects
            </span>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="admin-loading">
            Loading projects...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          projects.length === 0 && (
            <div className="empty-state">

              <div className="empty-state-icon">
                🏢
              </div>

              <h3>
                No projects found
              </h3>

              <p>
                Add your first Pune property project.
              </p>

              <Link
                to="/admin/projects/new"
                className="btn btn-primary"
              >
                + Add Project
              </Link>

            </div>
          )}

        {/* TABLE */}
        {!loading &&
          projects.length > 0 && (
            <div className="table-responsive">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Project
                    </th>

                    <th>
                      Builder
                    </th>

                    <th>
                      Locality
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {projects.map(
                    (project) => (
                      <tr
                        key={project._id}
                      >

                        {/* PROJECT */}
                        <td>

                          <div className="project-table-name">

                            <strong>
                              {getProjectName(
                                project
                              )}
                            </strong>

                            {project.slug && (
                              <small>
                                /{project.slug}
                              </small>
                            )}

                          </div>

                        </td>

                        {/* BUILDER */}
                        <td>
                          {getBuilderName(
                            project
                          )}
                        </td>

                        {/* LOCALITY */}
                        <td>
                          {getLocalityName(
                            project
                          )}
                        </td>

                        {/* STATUS */}
                        <td>

                          <span
                            className={`status-badge ${getStatusClass(
                              project.status
                            )}`}
                          >
                            {project.status ||
                              "—"}
                          </span>

                        </td>

                        {/* PRICE */}
                        <td>

                          {project.price ||
                          project.priceRange ||
                          project.startingPrice
                            ? project.price ||
                              project.priceRange ||
                              project.startingPrice
                            : "—"}

                        </td>

                        {/* ACTIONS */}
                        <td>

                          <div className="table-actions">

                            <Link
                              to={`/admin/projects/edit/${project._id}`}
                              className="action-btn action-edit"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="action-btn action-delete"
                              onClick={() =>
                                handleDelete(
                                  project._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

      {/* PAGINATION */}
      {!loading &&
        projects.length > 0 &&
        pagination.totalPages > 1 && (

          <div className="pagination">

            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1
                )
              }
              className="pagination-btn"
            >
              ← Previous
            </button>

            <span className="pagination-info">
              Page{" "}
              {pagination.currentPage}{" "}
              of{" "}
              {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={
                page >=
                pagination.totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1
                )
              }
              className="pagination-btn"
            >
              Next →
            </button>

          </div>

        )}

    </div>
  );
};

export default Projects;
