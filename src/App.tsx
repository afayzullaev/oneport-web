import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import { useAppSelector } from "./hooks/useAppSelector";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import DetailedOrder from "./pages/DetailedOrder";
import Trucks from "./pages/Trucks";
import ErrorBoundary from "./components/error/ErrorBoundary";
import Profile from "./pages/Profile";
import ProfileUpdate from "./pages/ProfileUpdate";
import PostCargo from "./pages/PostCargo";
import PostTruck from "./pages/PostTruck";
import DetailedTruck from "./pages/DetailedTruck";
import ExportersCatalog from "./pages/ExportersCatalog";
import MyOrders from "./pages/MyOrders";
import MyTrucks from "./pages/MyTrucks";
import CreateProfile from "./pages/createProfile";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useDelayedProfileFetch } from "./hooks/useDelayedProfileFetch";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.authToken.token);
  const profile = useAppSelector((state) => state.profile.profile);
  const { isLoading } = useDelayedProfileFetch();

  console.log("🔥 PrivateRoute - isLoading:", isLoading);
  console.log("🔥 PrivateRoute - token:", !!token);
  console.log("🔥 PrivateRoute - profile:", !!profile);

  if (isLoading) {
    return <LoadingSpinner message="Загрузка профиля..." />;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!profile) {
    return (
      <Navigate
        to="/create-profile"
        replace
      />
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <Header />
          <main>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/create-profile"
                element={<CreateProfile />}
              />

              <Route
                path="/orders"
                element={<Orders />}
              />
              <Route
                path="/orders/:orderId"
                element={<DetailedOrder />}
              />
              <Route
                path="/trucks/:truckId"
                element={<DetailedTruck />}
              />
              <Route
                path="/trucks"
                element={<Trucks />}
              />
              <Route
                path="/exporters-catalog"
                element={<ExportersCatalog />}
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <PrivateRoute>
                    <ProfileUpdate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-cargo"
                element={
                  <PrivateRoute>
                    <PostCargo />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-truck"
                element={
                  <PrivateRoute>
                    <PostTruck />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <PrivateRoute>
                    <MyOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-trucks"
                element={
                  <PrivateRoute>
                    <MyTrucks />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
