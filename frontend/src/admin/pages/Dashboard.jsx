import { useEffect, useState } from "react";

import {
  Building2,
  CheckCircle2,
  Users,
  MapPin,
  Sparkles,
  MessageSquareText,
  Bell,
  Plus,
  ArrowUpRight,
  Clock3,
  TrendingUp,
  FileText,
} from "lucide-react";

import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    publishedProjects: 0,
    builders: 0,
    localities: 0,
    amenities: 0,
    leads: 0,
    newLeads: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          projectsResponse,
          buildersResponse,
          localitiesResponse,
          amenitiesResponse,
          leadsResponse,
          newLeadsResponse,
        ] = await Promise.all([
          api.get("/projects?limit=1"),
          api.get("/builders"),
          api.get("/localities"),
          api.get("/amenities"),
          api.get("/leads?limit=1"),
          api.get("/leads?status=New&limit=1"),
        ]);

        setStats({
          projects:
            projectsResponse.data.pagination?.totalProjects ||
            projectsResponse.data.count ||
            0,

          publishedProjects:
            projectsResponse.data.data?.filter(
              (project) => project.published
            ).length || 0,

          builders:
            buildersResponse.data.count || 0,

          localities:
            localitiesResponse.data.count || 0,

          amenities:
            amenitiesResponse.data.count || 0,

          leads:
            leadsResponse.data.pagination?.totalLeads ||
            leadsResponse.data.count ||
            0,

          newLeads:
            newLeadsResponse.data.pagination?.totalLeads ||
            newLeadsResponse.data.count ||
            0,
        });
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: Building2,
      color: "blue",
      change: "+12.5%",
    },
    {
      title: "Published Projects",
      value: stats.publishedProjects,
      icon: CheckCircle2,
      color: "green",
      change: "+8.2%",
    },
    {
      title: "Builders",
      value: stats.builders,
      icon: Users,
      color: "purple",
      change: "+4.1%",
    },
    {
      title: "Localities",
      value: stats.localities,
      icon: MapPin,
      color: "orange",
      change: "+6.4%",
    },
    {
      title: "Amenities",
      value: stats.amenities,
      icon: Sparkles,
      color: "pink",
      change: "+3.2%",
    },
    {
      title: "Total Leads",
      value: stats.leads,
      icon: MessageSquareText,
      color: "cyan",
      change: "+18.6%",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: Bell,
      color: "red",
      change: "+24.8%",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}

      <div className="dashboard-header">

        <div>
          <div className="breadcrumb">
            Admin
            <span>/</span>
            Dashboard
          </div>

          <h1>
            Good evening, Admin
          </h1>

          <p>
            Here's what's happening with your
            Pune real estate platform today.
          </p>
        </div>

        <div className="dashboard-date">
          <Clock3 size={16} />
          <span>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </span>
        </div>

      </div>


      {/* STATISTICS */}

      <div className="dashboard-stats">

        {statsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className={`metric-card metric-${card.color}`}
              key={card.title}
            >

              <div className="metric-top">

                <div className="metric-icon">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <span className="metric-change">
                  <TrendingUp size={13} />
                  {card.change}
                </span>

              </div>

              <div className="metric-value">
                {loading ? "—" : card.value}
              </div>

              <div className="metric-label">
                {card.title}
              </div>

            </div>
          );
        })}

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">

        {/* PROJECT STATUS */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Project Overview</h2>

              <p>
                Current project distribution
              </p>
            </div>

            <button className="panel-action">
              View all
              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="project-status-list">

            <div className="status-row">
              <div className="status-name">
                <span className="status-dot blue" />
                New Launch
              </div>

              <strong>1</strong>
            </div>

            <div className="status-progress">
              <span
                style={{ width: "75%" }}
                className="blue"
              />
            </div>


            <div className="status-row">
              <div className="status-name">
                <span className="status-dot orange" />
                Under Construction
              </div>

              <strong>0</strong>
            </div>

            <div className="status-progress">
              <span
                style={{ width: "0%" }}
                className="orange"
              />
            </div>


            <div className="status-row">
              <div className="status-name">
                <span className="status-dot green" />
                Ready to Move
              </div>

              <strong>0</strong>
            </div>

            <div className="status-progress">
              <span
                style={{ width: "0%" }}
                className="green"
              />
            </div>

          </div>

        </section>


        {/* LEADS */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Lead Overview</h2>

              <p>
                Your enquiry pipeline
              </p>
            </div>

            <button className="panel-action">
              View leads
              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="lead-summary">

            <div className="lead-total">
              <span>Total Leads</span>

              <strong>
                {loading ? "—" : stats.leads}
              </strong>
            </div>

            <div className="lead-new">
              <div className="lead-new-icon">
                <Bell size={17} />
              </div>

              <div>
                <strong>
                  {loading ? "—" : stats.newLeads}
                </strong>

                <span>
                  New enquiries
                </span>
              </div>
            </div>

          </div>

          <div className="lead-chart-placeholder">

            <div className="chart-bars">
              <span style={{ height: "35%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "42%" }} />
              <span style={{ height: "70%" }} />
              <span style={{ height: "52%" }} />
              <span style={{ height: "82%" }} />
              <span style={{ height: "65%" }} />
            </div>

            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

          </div>

        </section>

      </div>


      {/* QUICK ACTIONS */}

      <section className="quick-action-panel">

        <div>
          <h2>Quick Actions</h2>

          <p>
            Manage your property platform quickly.
          </p>
        </div>

        <div className="quick-action-buttons">

          <a
            href="/admin/projects"
            className="quick-action"
          >
            <Building2 size={17} />
            <span>Add Project</span>
            <Plus size={15} />
          </a>

          <a
            href="/admin/builders"
            className="quick-action"
          >
            <Users size={17} />
            <span>Add Builder</span>
            <Plus size={15} />
          </a>

          <a
            href="/admin/localities"
            className="quick-action"
          >
            <MapPin size={17} />
            <span>Add Locality</span>
            <Plus size={15} />
          </a>

          <a
            href="/admin/articles"
            className="quick-action"
          >
            <FileTextIcon />
            <span>Add Article</span>
            <Plus size={15} />
          </a>

        </div>

      </section>

    </div>
  );
};

const FileTextIcon = () => (
  <FileText
    size={17}
    strokeWidth={1.8}
  />
);

export default Dashboard;