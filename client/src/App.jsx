import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FinanceManagerLayout from "./components/layout/FinanceManagerLayout.jsx";
import CreateInvoicePage from "./pages/CreateInvoicePage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import PayInvoice from "./pages/PayInvoice.jsx";
function App() {
  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/login' element={<LoginPage />} />
        {/* Public payment route */}
        <Route path='/pay/:token' element={<PayInvoice />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <FinanceManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path='invoices/create' element={<CreateInvoicePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
