import {
  CreditCard,
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

export default function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    // { icon: FileText, label: "Invoices", href: "/invoices" },
    // { icon: Users, label: "Customers", href: "/customers" },
    // { icon: DollarSign, label: "Payouts", href: "/payouts" },
    // { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className='w-64 bg-white border-r min-h-screen flex flex-col p-4 shadow-sm'>
      <div className='flex items-center gap-2 px-2 py-4 border-b'>
        <CreditCard className='h-6 w-6 text-brand' />
        <span className='text-lg font-semibold text-gray-800'>
          Micro Lending
        </span>
      </div>

      <nav className='flex-1 mt-6 space-y-2'>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-hover ` +
              (isActive ? "bg-brand text-slate-50" : "text-gray-600")
            }
          >
            <item.icon className='h-5 w-5' />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className='mt-4 pt-4 border-t'>
        <LogoutButton />
      </div>
    </aside>
  );
}

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logout());
    try {
      localStorage.removeItem("app_state");
    } catch (err) {
      // ignore
    }
    navigate("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className='w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100'
    >
      <LogOut className='h-5 w-5' />
      Logout
    </button>
  );
}
