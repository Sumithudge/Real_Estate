import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [builders, setBuilders] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    builder: "",
    locality: "",
    amenities: [],
    description: "",

    price: "",
    priceRange: "",
    status: "Upcoming",

    propertyType: "",
    configurations: "",
    possessionDate: "",
    reraNumber: "",

    address: "",
    mapLocation: "",

    image: "",
    images: [],

    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  /* =========================
     LOAD EXISTING PROJECT
  ========================= */

  const loadProject = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}`);

      const data = response.data.project || response.data;

      setForm({
        name: data.name || data.title || "",
        slug: data.slug || "",

        builder:
          typeof data.builder === "object"
            ? data.builder?._id || ""
            : data.builder || "",

        locality:
          typeof data.locality === "object"
            ? data.locality?._id || ""
            : data.locality || "",

        amenities: Array.isArray(data.amenities)
          ? data.amenities.map((item) =>
              typeof item === "object"
                ? item._id
                : item
            )
          : [],

        description: data.description || "",

        price: data.price || "",
        priceRange: data.priceRange || "",
        status: data.status || "Upcoming",

        propertyType: data.propertyType || "",
        configurations: Array.isArray(
          data.configurations
        )
          ? data.configurations.join(", ")
          : data.configurations || "",

        possessionDate:
          data.possessionDate
            ? String(data.possessionDate).substring(0, 10)
            : "",

        reraNumber: data.reraNumber || "",

        address: data.address || "",
        mapLocation: data.mapLocation || "",

        image: data.image || "",

        images: Array.isArray(data.images)
          ? data.images
          : [],

        seoTitle:
          data.seoTitle ||
          data.metaTitle ||
          "",

        seoDescription:
          data.seoDescription ||
          data.metaDescription ||
          "",

        seoKeywords:
          Array.isArray(data.seoKeywords)
            ? data.seoKeywords.join(", ")
            : data.seoKeywords || "",
      });
    } catch (err) {
      console.error("Load project error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load project"
      );
    }
  }, [id]);

  /* =========================
     LOAD BUILDERS / LOCALITIES / AMENITIES
  ========================= */

  const loadFormData = useCallback(async () => {
    try {
      const [
        buildersResponse,
        localitiesResponse,
        amenitiesResponse,
      ] = await Promise.all([
        api.get("/builders"),
        api.get("/localities"),
        api.get("/amenities"),
      ]);

      const buildersData = buildersResponse.data;
      const localitiesData = localitiesResponse.data;
      const amenitiesData = amenitiesResponse.data;

      setBuilders(
        Array.isArray(buildersData)
          ? buildersData
          : buildersData.builders || []
      );

      setLocalities(
        Array.isArray(localitiesData)
          ? localitiesData
          : localitiesData.localities || []
      );

      setAmenities(
        Array.isArray(amenitiesData)
          ? amenitiesData
          : amenitiesData.amenities || []
      );

      if (isEditMode) {
        await loadProject();
      }
    } catch (err) {
      console.error("Load project form data error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load project form data"
      );
    } finally {
      setLoadingData(false);
    }
  }, [isEditMode, loadProject]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadFormData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadFormData]);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     AMENITIES
  ========================= */

  const handleAmenityChange = (amenityId) => {
    setForm((previous) => {
      const alreadySelected =
        previous.amenities.includes(amenityId);

      if (alreadySelected) {
        return {
          ...previous,
          amenities: previous.amenities.filter(
            (id) => id !== amenityId
          ),
        };
      }

      return {
        ...previous,
        amenities: [
          ...previous.amenities,
          amenityId,
        ],
      };
    });
  };

  /* =========================
     AUTO SLUG
  ========================= */

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      slug:
        previous.slug === "" ||
        previous.slug === generateSlug(previous.name)
          ? generateSlug(value)
          : previous.slug,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.name.trim()) {
        throw new Error("Project name is required");
      }

      if (!form.builder) {
        throw new Error("Please select a builder");
      }

      if (!form.locality) {
        throw new Error("Please select a locality");
      }

      const projectData = {
        name: form.name.trim(),

        slug: form.slug.trim(),

        builder: form.builder,

        locality: form.locality,

        amenities: form.amenities,

        description: form.description.trim(),

        price: form.price,

        priceRange: form.priceRange,

        status: form.status,

        propertyType: form.propertyType,

        configurations: form.configurations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        possessionDate:
          form.possessionDate || undefined,

        reraNumber: form.reraNumber,

        address: form.address,

        mapLocation: form.mapLocation,

        image: form.image,

        images: form.images,

        seoTitle: form.seoTitle,

        seoDescription: form.seoDescription,

        seoKeywords: form.seoKeywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        await api.put(
          `/projects/${id}`,
          projectData
        );

        setSuccess(
          "Project updated successfully."
        );
      } else {
        await api.post(
          "/projects",
          projectData
        );

        setSuccess(
          "Project created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/projects");
      }, 700);
    } catch (err) {
      console.error(
        "Save project error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save project"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="admin-page">
        <div className="admin-panel">
          <div className="admin-loading">
            Loading project form...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page project-form-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            {isEditMode
              ? "Edit Project"
              : "Add Project"}
          </h1>

          <p>
            {isEditMode
              ? "Update project information."
              : "Add a new Pune real estate project."}
          </p>
        </div>

        <Link
          to="/admin/projects"
          className="btn btn-secondary"
        >
          ← Back to Projects
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* BASIC INFORMATION */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Basic Information</h2>
              <p>
                Main information about the project.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group form-group-full">
              <label>
                Project Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Example: Kolte Patil Life Republic"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Slug *
              </label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="kolte-patil-life-republic"
                required
              />

              <small>
                Used in the project URL.
              </small>
            </div>

            <div className="form-group">
              <label>
                Status *
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
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

            <div className="form-group">
              <label>
                Builder *
              </label>

              <select
                name="builder"
                value={form.builder}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Builder
                </option>

                {builders.map((builder) => (
                  <option
                    key={builder._id}
                    value={builder._id}
                  >
                    {builder.name ||
                      builder.builderName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Locality *
              </label>

              <select
                name="locality"
                value={form.locality}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Locality
                </option>

                {localities.map((locality) => (
                  <option
                    key={locality._id}
                    value={locality._id}
                  >
                    {locality.name ||
                      locality.localityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Property Type
              </label>

              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
              >
                <option value="">
                  Select Type
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Plot">
                  Plot
                </option>

                <option value="Row House">
                  Row House
                </option>

                <option value="Commercial">
                  Commercial
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Description</h2>
            </div>
          </div>

          <div className="form-group">

            <label>
              Project Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              placeholder="Write detailed information about the project..."
            />

          </div>

        </div>

        {/* PROPERTY DETAILS */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Property Details</h2>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Price
              </label>

              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="₹ 85 Lakh onwards"
              />
            </div>

            <div className="form-group">
              <label>
                Price Range
              </label>

              <input
                type="text"
                name="priceRange"
                value={form.priceRange}
                onChange={handleChange}
                placeholder="₹85 L - ₹1.50 Cr"
              />
            </div>

            <div className="form-group">
              <label>
                Configurations
              </label>

              <input
                type="text"
                name="configurations"
                value={form.configurations}
                onChange={handleChange}
                placeholder="1 BHK, 2 BHK, 3 BHK"
              />

              <small>
                Separate multiple configurations with commas.
              </small>
            </div>

            <div className="form-group">
              <label>
                Possession Date
              </label>

              <input
                type="date"
                name="possessionDate"
                value={form.possessionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                RERA Number
              </label>

              <input
                type="text"
                name="reraNumber"
                value={form.reraNumber}
                onChange={handleChange}
                placeholder="P52100012345"
              />
            </div>

            <div className="form-group">
              <label>
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Project address"
              />
            </div>

            <div className="form-group form-group-full">
              <label>
                Map Location
              </label>

              <input
                type="text"
                name="mapLocation"
                value={form.mapLocation}
                onChange={handleChange}
                placeholder="Google Maps URL"
              />
            </div>

          </div>

        </div>

        {/* AMENITIES */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Amenities</h2>

              <p>
                Select amenities available in this project.
              </p>
            </div>
          </div>

          {amenities.length === 0 ? (
            <div className="empty-form-message">
              No amenities found. Add amenities first.
            </div>
          ) : (
            <div className="amenities-grid">

              {amenities.map((amenity) => (

                <label
                  key={amenity._id}
                  className="amenity-checkbox"
                >

                  <input
                    type="checkbox"
                    checked={form.amenities.includes(
                      amenity._id
                    )}
                    onChange={() =>
                      handleAmenityChange(
                        amenity._id
                      )
                    }
                  />

                  <span>
                    {amenity.name ||
                      amenity.title ||
                      amenity.amenityName}
                  </span>

                </label>

              ))}

            </div>
          )}

        </div>

        {/* IMAGE */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Images</h2>

              <p>
                Add project image URLs.
              </p>
            </div>
          </div>

          <div className="form-group">

            <label>
              Main Image URL
            </label>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/project-image.jpg"
            />

          </div>

        </div>

        {/* SEO */}
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>SEO Information</h2>

              <p>
                Optimize this project page for Google.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group form-group-full">
              <label>
                SEO Title
              </label>

              <input
                type="text"
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
                placeholder="Best 2 & 3 BHK Projects in Pune"
              />
            </div>

            <div className="form-group form-group-full">
              <label>
                SEO Description
              </label>

              <textarea
                name="seoDescription"
                value={form.seoDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Discover project details, pricing, amenities and location..."
              />
            </div>

            <div className="form-group form-group-full">
              <label>
                SEO Keywords
              </label>

              <input
                type="text"
                name="seoKeywords"
                value={form.seoKeywords}
                onChange={handleChange}
                placeholder="pune property, pune flats, 2 bhk pune"
              />

              <small>
                Separate keywords with commas.
              </small>
            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="form-actions">

          <Link
            to="/admin/projects"
            className="btn btn-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Project"
              : "Save Project"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default ProjectForm;
