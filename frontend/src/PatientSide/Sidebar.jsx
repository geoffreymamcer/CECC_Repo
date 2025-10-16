const Sidebar = ({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    {
      name: "Home",
      key: "home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Appointments",
      key: "appointments",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      name: "Products",
      key: "products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      name: "Profile",
      key: "profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
  ];

  return (
    <div
      className={`bg-deep-red text-white w-full md:w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out fixed md:fixed h-full z-20 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <div>
          <h2 className="text-2xl font-bold mb-8 mt-4 text-center">
            My Portal
          </h2>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setActiveNav(item.key);
                      // Automatically close sidebar on mobile after selection
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center w-full p-3 rounded transition-colors duration-200 text-left ${
                      activeNav === item.key ? "bg-dark-red" : "hover:bg-dark-red"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      ></path>
                    </svg>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto pb-6">
          <div className="p-4 bg-dark-red rounded-lg mb-4 animate-pulse">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm mb-3">Contact our support team 24/7</p>
            <button className="w-full px-3 py-1 bg-white text-dark-red text-sm rounded hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02]">
              Contact
            </button>
          </div>
          <div className="text-center text-sm text-gray-300">
            <p>© 2023 VisionCare</p>
            <p>v2.4.1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
