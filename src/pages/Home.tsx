import {
  Truck,
  Package,
  Users,
  Clock,
  Search,
  MapPin,
  Zap,
  Rocket,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  const Hero = (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur rounded-full p-3">
              <Rocket className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Соединяем грузоперевозчиков
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {" "}
              в реальном времени
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            Находите грузы и водителей быстро и эффективно. Платформа нового
            поколения для транспортной логистики Узбекистана.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Найти грузы
              </Button>
            </Link>
            <Link to="/trucks">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                <Truck className="h-5 w-5 mr-2" />
                Найти водителей
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  const Features = (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Почему выбирают нашу платформу?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Мы создаем удобную экосистему для эффективного взаимодействия между
            грузовладельцами и перевозчиками
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Быстрый поиск
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Находите подходящие грузы или водителей за считанные секунды
              благодаря продвинутым фильтрам поиска
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Реальное время
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Все объявления и статусы обновляются мгновенно, что позволяет
              принимать быстрые решения
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Прямая связь
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Общайтесь напрямую с контрагентами без посредников и
              дополнительных комиссий
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Простота использования
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Интуитивно понятный интерфейс позволяет легко размещать объявления
              и управлять заказами
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Рост бизнеса
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Расширяйте клиентскую базу и увеличивайте оборот благодаря доступу
              к большой аудитории
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Все виды грузов
            </h3>
            <p className="text-gray-600 leading-relaxed">
              От стандартных перевозок до специализированных грузов - найдите
              решение для любой задачи
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const HowItWorks = (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Как это работает?
          </h2>
          <p className="text-xl text-gray-600">
            Простые шаги к эффективной логистике
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">
                Для грузовладельцев
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Создайте профиль и разместите информацию о грузе
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Получайте предложения от перевозчиков в режиме реального
                  времени
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Выбирайте лучшее предложение и заключайте сделку
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Отслеживайте статус доставки онлайн
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">
                Для перевозчиков
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Зарегистрируйтесь и добавьте информацию о вашем транспорте
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Просматривайте актуальные заказы в вашем регионе
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Отправляйте предложения и договаривайтесь о цене
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Выполняйте заказы и получайте оплату
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const Disclaimer = (
    <section className="py-16 bg-yellow-50 border-t border-yellow-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800 uppercase tracking-wide">
              Важная информация
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Мы развивающийся стартап
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Наша платформа находится в стадии активной разработки. Мы не
            предоставляем гарантий и не несем ответственности за сделки между
            пользователями. Вся ответственность за коммерческие отношения лежит
            на участниках сделки.
          </p>
          <div className="bg-white/70 backdrop-blur rounded-lg p-6 border border-yellow-200">
            <p className="text-gray-600">
              <strong>MVP версия:</strong> Мы создаем минимально жизнеспособный
              продукт и постоянно улучшаем функциональность на основе отзывов
              наших пользователей. Присоединяйтесь к нам в этом путешествии!
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const CTA = (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Готовы начать работу с нами?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Присоединяйтесь к растущему сообществу логистических партнеров
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-3 text-lg"
            >
              Войти в систему
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {Hero}
      {Features}
      {HowItWorks}
      {Disclaimer}
      {CTA}
    </div>
  );
}
