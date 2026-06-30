import {
  FaFileLines,
  FaInbox,
  FaLayerGroup,
  FaNewspaper,
  FaTableColumns,
  FaUserTie,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const groups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/admin", icon: FaTableColumns },
      { label: "Layout editor", path: "/admin/layout", icon: FaLayerGroup },
      { label: "News", path: "/admin/news", icon: FaNewspaper },
    ],
  },
  {
    label: "Mentors",
    items: [
      {
        label: "Submissions",
        path: "/admin/submissions?queue=mentors",
        icon: FaInbox,
      },
      { label: "Management", path: "/admin/mentors", icon: FaUserTie },
    ],
  },
  {
    label: "Publications",
    items: [
      {
        label: "Submissions",
        path: "/admin/submissions?queue=publications",
        icon: FaInbox,
      },
      { label: "Management", path: "/admin/publications", icon: FaFileLines },
    ],
  },
];

const AdminSidebar = ({ description }: { description: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = `${location.pathname}${location.search}`;

  const isActive = (path: string) => {
    if (path.includes("?")) return currentPath === path;
    return location.pathname === path;
  };

  return (
    <aside className="z-20 flex w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-amber-50/10 bg-black shadow-2xl shadow-black">
      <div className="border-b border-amber-50/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6a1f]">
          Admin
        </p>
        <h1 className="mt-1 bg-gradient-to-r from-amber-50 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
          <a href="/">SRC2026</a>
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-amber-50/50">
          {description}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-5 p-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-50/30">
              {group.label}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-left text-sm transition-all duration-300 ${
                      active
                        ? "border-[#ff6a1f] bg-gradient-to-r from-[#ff6a1f]/10 to-transparent font-semibold text-[#ff6a1f]"
                        : "border-transparent text-amber-50/60 hover:bg-amber-50/5 hover:text-amber-50"
                    }`}
                  >
                    <Icon className="shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
