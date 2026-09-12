"use client";

import { useMemo, useState } from "react";
import { Footer } from "../components/ui/footer";
import { Header } from "../components/ui/header";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileBarChart,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Moon,
  Package,
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const navGroups = [
  { label: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "People",
    items: [
      { label: "Students", icon: GraduationCap },
      { label: "Staff & Teachers", icon: Users },
      { label: "Guardians", icon: ShieldCheck },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Classes & Schedule", icon: CalendarDays },
      { label: "Attendance", icon: ClipboardCheck },
      { label: "Exams & Grades", icon: FileText },
      { label: "Curriculum", icon: BookOpen },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Fees & Invoices", icon: WalletCards },
      { label: "Payments", icon: CreditCard },
      { label: "Financial Reports", icon: CircleDollarSign },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Inventory", icon: Package },
      { label: "Library", icon: Library },
      { label: "Facilities", icon: Building2 },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Messages", icon: MessageSquare },
      { label: "Announcements", icon: Bell },
    ],
  },
  {
    label: "Reports & Audit",
    items: [
      { label: "Reports", icon: FileBarChart },
      { label: "Audit Log", icon: Activity },
    ],
  },
];

const metrics = [
  {
    label: "Total students",
    value: "1,248",
    change: "+8.2%",
    trend: "up",
    icon: GraduationCap,
    tone: "blue",
  },
  {
    label: "Attendance rate",
    value: "94.8%",
    change: "+2.4%",
    trend: "up",
    icon: ClipboardCheck,
    tone: "green",
  },
  {
    label: "Fees collected",
    value: "$48,290",
    change: "+12.6%",
    trend: "up",
    icon: CircleDollarSign,
    tone: "orange",
  },
  {
    label: "Pending actions",
    value: "23",
    change: "Needs review",
    trend: "down",
    icon: AlertTriangle,
    tone: "red",
  },
];

const attendance = [64, 72, 69, 82, 76, 88, 91, 86, 94, 89, 96, 92];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const activities = [
  {
    title: "Payment received",
    detail: "Sarah Johnson • INV-1048",
    time: "8 min ago",
    icon: CircleDollarSign,
    color: "green",
  },
  {
    title: "New student enrolled",
    detail: "Olivia Williams • Grade 5A",
    time: "42 min ago",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Attendance submitted",
    detail: "Mr. Patel • Grade 8B",
    time: "1 hr ago",
    icon: ClipboardCheck,
    color: "violet",
  },
  {
    title: "Announcement published",
    detail: "Term 2 parent meeting",
    time: "2 hrs ago",
    icon: Bell,
    color: "orange",
  },
];

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon;
  return (
    <article className="metric-card">
      <div className={`metric-icon ${metric.tone}`}>
        <Icon size={19} strokeWidth={2} />
      </div>
      <div className="metric-copy">
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        <small className={metric.trend === "up" ? "positive" : "negative"}>
          {metric.trend === "up" ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
          {metric.change}
        </small>
      </div>
      <button
        className="icon-button subtle"
        aria-label={`More options for ${metric.label}`}
      >
        <MoreHorizontal size={18} />
      </button>
    </article>
  );
}

function Chart() {
  const points = useMemo(
    () =>
      attendance.map((value, index) => `${(index / 11) * 100},${100 - value}`),
    [],
  );
  return (
    <div className="chart-wrap">
      <div className="chart-y">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      <div className="chart-area">
        <div className="chart-grid">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <svg
          className="line-chart"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-label="Attendance rate trend"
        >
          <defs>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity=".2" />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,100 ${points.join(" ")} 100,100`}
            fill="url(#fill)"
          />
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="var(--blue)"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="chart-x">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function action(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  }

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          {sidebarOpen && (
            <div>
              <strong>Xenon</strong>
              <span>School Management</span>
            </div>
          )}
          <button
            className="collapse-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>
        <button
          className="school-switcher"
          onClick={() => setSchoolOpen(!schoolOpen)}
          aria-expanded={schoolOpen}
        >
          <div className="school-avatar">AH</div>
          {sidebarOpen && (
            <>
              <div className="school-meta">
                <strong>Adams Hill Academy</strong>
                <span>Current school</span>
              </div>
              <ChevronDown size={16} />
            </>
          )}
        </button>
        {schoolOpen && sidebarOpen && (
          <div className="school-menu">
            <button
              onClick={() => action("School switched to Northfield Prep")}
            >
              Northfield Prep <Check size={14} />
            </button>
            <button
              onClick={() =>
                action("School switcher is ready for more tenants")
              }
            >
              Add another school <Plus size={14} />
            </button>
          </div>
        )}
        <nav className="nav" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {sidebarOpen && <span className="nav-label">{group.label}</span>}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className={`nav-item ${active === item.label ? "active" : ""}`}
                    key={item.label}
                    onClick={() => {
                      setActive(item.label);
                      action(`${item.label} module selected`);
                    }}
                    title={item.label}
                  >
                    <Icon size={18} />
                    <span>{sidebarOpen && item.label}</span>
                    {sidebarOpen && item.label === "Messages" && (
                      <b className="nav-badge">4</b>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => action("Settings module selected")}
          >
            <Settings size={18} />
            <span>{sidebarOpen && "Settings"}</span>
          </button>
          <div className="sidebar-version">
            {sidebarOpen && (
              <>
                <span>XENON SMS</span>
                <small>v2.4.0 • Pro plan</small>
              </>
            )}
          </div>
        </div>
      </aside>

      <section className="workspace">
        <Header
          activeSection={active}
          dark={dark}
          profileOpen={profileOpen}
          onAction={action}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onProfileToggle={() => setProfileOpen(!profileOpen)}
          onSearchOpen={() => setSearchOpen(true)}
          onThemeToggle={() => setDark(!dark)}
        />
        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Tuesday, October 15, 2024</p>
              <h1>
                Good morning, Jordan <span>—</span>
              </h1>
              <p className="subheading">
                Here&apos;s what&apos;s happening across your school today.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => action("Create menu opened")}
            >
              <Plus size={17} /> Create new
            </button>
          </div>
          {notice && (
            <div className="toast">
              <Check size={16} />
              {notice}
              <button onClick={() => setNotice(null)} aria-label="Dismiss">
                <X size={15} />
              </button>
            </div>
          )}
          <section className="metrics-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </section>
          <section className="main-grid">
            <article className="panel attendance-panel">
              <div className="panel-heading">
                <div>
                  <h2>Attendance overview</h2>
                  <p>School-wide attendance performance</p>
                </div>
                <button
                  className="select-button"
                  onClick={() => action("Attendance period changed")}
                >
                  This year <ChevronDown size={14} />
                </button>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-dot blue" />
                  Attendance rate
                </span>
                <strong>
                  94.8% <small>+2.4% vs last year</small>
                </strong>
              </div>
              <Chart />
            </article>
            <article className="panel schedule-panel">
              <div className="panel-heading">
                <div>
                  <h2>Today&apos;s schedule</h2>
                  <p>Tuesday, October 15</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => action("Calendar opened")}
                >
                  View calendar <ChevronRight size={15} />
                </button>
              </div>
              <div className="schedule-list">
                <div className="schedule-item now">
                  <time>
                    08:00<span>AM</span>
                  </time>
                  <div className="schedule-line" />
                  <div>
                    <strong>Staff briefing</strong>
                    <span>Conference room A</span>
                  </div>
                  <b>Now</b>
                </div>
                <div className="schedule-item">
                  <time>
                    10:30<span>AM</span>
                  </time>
                  <div className="schedule-line" />
                  <div>
                    <strong>Grade 8 parent meeting</strong>
                    <span>Room 204 • 12 attendees</span>
                  </div>
                </div>
                <div className="schedule-item">
                  <time>
                    01:00<span>PM</span>
                  </time>
                  <div className="schedule-line" />
                  <div>
                    <strong>Term 2 exam review</strong>
                    <span>Library • Academic team</span>
                  </div>
                </div>
                <div className="schedule-item">
                  <time>
                    03:30<span>PM</span>
                  </time>
                  <div className="schedule-line" />
                  <div>
                    <strong>Football practice</strong>
                    <span>Sports field</span>
                  </div>
                </div>
              </div>
            </article>
          </section>
          <section className="bottom-grid">
            <article className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent activity</h2>
                  <p>Latest updates from your school</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => action("Activity log opened")}
                >
                  View all <ChevronRight size={15} />
                </button>
              </div>
              <div className="activity-list">
                {activities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="activity-item" key={item.title}>
                      <div className={`activity-icon ${item.color}`}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                      <time>{item.time}</time>
                    </div>
                  );
                })}
              </div>
            </article>
            <article className="panel actions-panel">
              <div className="panel-heading">
                <div>
                  <h2>Quick actions</h2>
                  <p>Common tasks at your fingertips</p>
                </div>
              </div>
              <div className="quick-grid">
                <button onClick={() => action("Student registration started")}>
                  <div className="quick-icon blue">
                    <GraduationCap size={18} />
                  </div>
                  <span>Register student</span>
                  <ChevronRight size={15} />
                </button>
                <button onClick={() => action("Invoice creation started")}>
                  <div className="quick-icon orange">
                    <WalletCards size={18} />
                  </div>
                  <span>Create invoice</span>
                  <ChevronRight size={15} />
                </button>
                <button onClick={() => action("Announcement composer opened")}>
                  <div className="quick-icon violet">
                    <Bell size={18} />
                  </div>
                  <span>Post announcement</span>
                  <ChevronRight size={15} />
                </button>
                <button onClick={() => action("Report builder opened")}>
                  <div className="quick-icon green">
                    <FileBarChart size={18} />
                  </div>
                  <span>Build a report</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </article>
          </section>
          <section className="panel payments-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent payments</h2>
                <p>Latest fee transactions across the school</p>
              </div>
              <button
                className="text-button"
                onClick={() => action("Payments module opened")}
              >
                View payments <ChevronRight size={15} />
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="person">
                        <div className="person-avatar pink">SJ</div>
                        <div>
                          <strong>Sarah Johnson</strong>
                          <span>Grade 8A</span>
                        </div>
                      </div>
                    </td>
                    <td>INV-1048</td>
                    <td>Oct 15, 2024</td>
                    <td>Card</td>
                    <td>
                      <strong>$840.00</strong>
                    </td>
                    <td>
                      <span className="status paid">Paid</span>
                    </td>
                    <td>
                      <button
                        className="icon-button subtle"
                        aria-label="More payment options"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="person">
                        <div className="person-avatar teal">DO</div>
                        <div>
                          <strong>Daniel Okafor</strong>
                          <span>Grade 6B</span>
                        </div>
                      </div>
                    </td>
                    <td>INV-1047</td>
                    <td>Oct 15, 2024</td>
                    <td>Transfer</td>
                    <td>
                      <strong>$620.00</strong>
                    </td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                    <td>
                      <button
                        className="icon-button subtle"
                        aria-label="More payment options"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="person">
                        <div className="person-avatar yellow">MC</div>
                        <div>
                          <strong>Maya Chen</strong>
                          <span>Grade 10A</span>
                        </div>
                      </div>
                    </td>
                    <td>INV-1046</td>
                    <td>Oct 14, 2024</td>
                    <td>Cash</td>
                    <td>
                      <strong>$1,120.00</strong>
                    </td>
                    <td>
                      <span className="status paid">Paid</span>
                    </td>
                    <td>
                      <button
                        className="icon-button subtle"
                        aria-label="More payment options"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <Footer />
        </div>
      </section>
      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            className="search-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-search">
              <Search size={19} />
              <input
                autoFocus
                placeholder="Search students, invoices, reports..."
              />
              <kbd>ESC</kbd>
            </div>
            <div className="search-results">
              <p>Quick navigation</p>
              {["Students", "Attendance", "Fees & Invoices", "Reports"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActive(item);
                      setSearchOpen(false);
                    }}
                  >
                    <Search size={16} />
                    {item}
                    <ChevronRight size={15} />
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
