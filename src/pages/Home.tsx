import { Truck, Shield } from "lucide-react";

export default function Home() {
  const Hero = (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Быстрый поиск перевозчиков в Узбекистане
          </h1>
          <p className="mt-4 text-gray-600 text-base md:text-lg">
            Зарегистрируйтесь и бесплатно добавляйте грузы, находите надёжных
            перевозчиков и управляйте перевозками онлайн.
          </p>
          {/* Никаких кнопок/ссылок здесь */}
        </div>
      </div>
    </section>
  );

  const Safety = (
    <section className="max-w-6xl mx-auto px-6 mt-10">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900">
          Безопасность и надёжность
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Мы гарантируем безопасность ваших грузов и прозрачность перевозок.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h4 className="text-md font-semibold text-gray-900">
                Страхование грузов
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                Все грузы застрахованы на время перевозки.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <Truck className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h4 className="text-md font-semibold text-gray-900">
                Проверенные перевозчики
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                Все перевозчики проходят строгую проверку.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h4 className="text-md font-semibold text-gray-900">
                Гарантия возврата груза
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                В случае форс-мажора мы гарантируем возврат груза.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {Hero}
      {Safety}
    </div>
  );
}
