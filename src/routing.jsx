import React, { useState, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import PageLoading from "./components/PageLoading/PageLoading";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RequireAuth from "./layouts/RequiredAuth";
import DashboardLayout from "./layouts/DashboardLayout";
import SingleHotel from "./pages/SingleHotel";
import Hotels from "./pages/Hotels";
import Services from "./pages/Service";
import AdminDashboard from "./pages/AdminDashboard";
import EditHotel from "./pages/EditHotel";
import CreateHotel from "./pages/CreateHotel";
import CartPage from "./pages/Cart";
import Profile from "./pages/Profile";

function Routings() {
  const [cartChanged, setCartChanged] = useState(false);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <Suspense fallback={<PageLoading />}>
              <RequireAuth>
                <DashboardLayout>
                  <SignIn />
                </DashboardLayout>
              </RequireAuth>
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<PageLoading />}>
              <RequireAuth>
                <DashboardLayout>
                  <SignUp />
                </DashboardLayout>
              </RequireAuth>
            </Suspense>
          }
        />
        <Route
          path="/hotel/:hotelId"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout cartChanged={cartChanged}>
                <SingleHotel
                  cartChanged={cartChanged}
                  setCartChanged={setCartChanged}
                />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/hotels"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <Hotels />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <Services />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout cartChanged={cartChanged}>
                <CartPage
                  cartChanged={cartChanged}
                  setCartChanged={setCartChanged}
                />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/admin/hotel/create"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <CreateHotel />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/admin/hotel/:hotelId"
          element={
            <Suspense fallback={<PageLoading />}>
              <DashboardLayout>
                <EditHotel />
              </DashboardLayout>
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default Routings;
