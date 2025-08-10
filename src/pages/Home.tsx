// src/pages/Home.tsx
import { useAppSelector } from "../hooks/useAppSelector";
import { useGetMyProfileQuery } from "../api/profileApi";
import ProfileForm from "@/components/forms/ProfileForm";
import OrdersTable from "@/components/tables/OrdersTable";
import ErrorBoundary from "@/components/error/ErrorBoundary";

export default function Home() {
  const token = useAppSelector((state) => state.authToken.token);
  const {
    data: profile,
    isLoading,
    error,
  } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });

  if (!token)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">
          Вы не авторизованы. Перейдите на страницу логина.
        </p>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Загрузка профиля...</p>
      </div>
    );

  // If there's no profile or API returns 404, show the profile creation form
  if (!profile || (error && "status" in error && error.status === 404)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <ProfileForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary
        fallback={
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">
                Ошибка загрузки таблицы заказов
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Не удалось отобразить таблицу заказов. Попробуйте обновить
                страницу.
              </p>
            </div>
          </div>
        }
      >
        <OrdersTable />
      </ErrorBoundary>
    </div>
  );
}
