const listItem = [
  {
    href: "/home#about",
    label: "About",
  },
  {
    href: "/home#research-fields",
    label: "Research Fields",
  },
  {
    href: "/home#awards",
    label: "Awards",
  },
  {
    href: "/home#regulations",
    label: "Regulations",
  },
  {
    href: "/home#milestones",
    label: "Milestones",
  },
  {
    href: "/home#workshops",
    label: "Workshops",
  },
  {
    href: "/publications",
    label: "Publications",
  },
  {
    href: "/mentors",
    label: "Mentors",
  },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-80 max-w-[85vw] bg-black text-white shadow-2xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="text-sm font-semibold tracking-wide">Menu</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-white!"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="menu menu-vertical gap-1 p-4 [&>li>a]:text-white!">
          {listItem.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default MobileMenu;
