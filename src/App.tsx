
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.authToken.token);
  return token ? children : <Navigate to="/login" replace />;
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
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <PrivateRoute>
                    <DetailedOrder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trucks/:truckId"
                element={
                  <PrivateRoute>
                    <DetailedTruck />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trucks"
                element={
                  <PrivateRoute>
                    <Trucks />
                  </PrivateRoute>
                }
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
                path="/exporters-catalog"
                element={
                  <PrivateRoute>
                    <ExportersCatalog />
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
