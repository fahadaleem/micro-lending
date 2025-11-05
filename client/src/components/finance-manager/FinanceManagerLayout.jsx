// src/components/finance-manager/layout/FinanceManagerLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/sidebar.jsx";
import Header from "./dashboard/Header.jsx";
import { HeaderProvider } from "./HeaderContext";

export default function FinanceManagerLayout() {
  return (
    <HeaderProvider>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Header />
          <main className='rounded-lg p-6'>
            <Outlet /> {/* Child routes render here */}
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
}
