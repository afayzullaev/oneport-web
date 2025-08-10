import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyProfileQuery, useUpdateProfileMutation } from '@/api/profileApi';
import { useAppSelector } from '@/hooks/useAppSelector';
import LocationSelect from '@/components/ui/LocationSelect';
import type { LocationResult } from '@/api/locationApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Plus, Minus, User, Phone, MapPin, Package } from 'lucide-react';

const ProfileUpdate: React.FC = () => {
  const navigate = useNavigate();
  
  // Get user token to check if logged in
  const token = useAppSelector((state) => state.authToken.token);
  
  // Fetch user profile
  const { data: profile, isLoading, error } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  // Form state for all profile fields
  const [formData, setFormData] = useState({
    type: 'individual' as 'individual' | 'legal_entity',
    businessType: 'cargo_owner' as 'carrier' | 'cargo_owner',
    fullName: '',
    companyName: '',
    companyTIN: '',
    activityType: '',
    goods: [''],
    unit: 'тонна' as 'млн шт' | 'тонна' | 'шт' | 'млн долл. США' | 'кг' | 'м³' | 'литр' | 'метр' | 'м²',
    annualProductionCapacity: 0,
    representativeFullname: '',
    phoneNumbers: [''],
    emails: [''],
    country: '',
    postalCode: '',
    address: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        type: profile.type || 'individual',
        businessType: profile.businessType || 'cargo_owner',
        fullName: profile.fullName || '',
        companyName: profile.companyName || '',
        companyTIN: profile.companyTIN || '',
        activityType: profile.activityType || '',
        goods: profile.goods?.length ? profile.goods : [''],
        unit: profile.unit || 'тонна',
        annualProductionCapacity: profile.annualProductionCapacity || 0,
        representativeFullname: profile.representativeFullname || '',
        phoneNumbers: profile.phoneNumbers?.length ? profile.phoneNumbers : [''],
        emails: profile.emails?.length ? profile.emails : [''],
        country: profile.country || '',
        postalCode: profile.postalCode || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile?._id) return;
    
    try {
      const cleanedData = {
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter(phone => phone.trim()),
        emails: formData.emails.filter(email => email.trim()),
        goods: formData.goods.filter(good => good.trim()),
      };

      await updateProfile({
        profileId: profile._id,
        updates: cleanedData
      }).unwrap();
      
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLocationSelect = (location: LocationResult | null) => {
    setFormData({
      ...formData,
      country: location?.address?.country || location?.display_place || '',
    });
  };

  const addField = (field: 'phoneNumbers' | 'emails' | 'goods') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeField = (field: 'phoneNumbers' | 'emails' | 'goods', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const updateField = (field: 'phoneNumbers' | 'emails' | 'goods', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Вход требуется</h2>
          <p className="text-gray-600">Войдите в систему для редактирования профиля</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">Не удалось загрузить профиль</p>
          <Button onClick={() => navigate('/profile')} variant="outline">
            Вернуться к профилю
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Редактировать профиль</h1>
                <p className="text-gray-600">Обновите информацию о себе или компании</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            
            {/* Basic Information */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Основная информация</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип профиля
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="individual">Физическое лицо</option>
                    <option value="legal_entity">Юридическое лицо</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип деятельности
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cargo_owner">Грузовладелец</option>
                    <option value="carrier">Перевозчик</option>
                  </select>
                </div>
              </div>

              {/* Name/Company fields based on type */}
              <div className="mt-6 space-y-4">
                {formData.type === 'individual' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Полное имя
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Введите полное имя"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название компании
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Введите название компании"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ИНН компании
                        </label>
                        <input
                          type="text"
                          value={formData.companyTIN}
                          onChange={(e) => setFormData({...formData, companyTIN: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123456789"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Вид деятельности
                        </label>
                        <input
                          type="text"
                          value={formData.activityType}
                          onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Производство, торговля и т.д."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Полное имя представителя
                      </label>
                      <input
                        type="text"
                        value={formData.representativeFullname}
                        onChange={(e) => setFormData({...formData, representativeFullname: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ФИО представителя компании"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Goods and Production */}
            {formData.type === 'legal_entity' && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Товары и производство</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Товары/продукция
                    </label>
                    {formData.goods.map((good, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={good}
                          onChange={(e) => updateField('goods', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Название товара/продукции"
                        />
                        {formData.goods.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeField('goods', index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addField('goods')}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить товар
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Единица измерения
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="тонна">тонна</option>
                        <option value="кг">кг</option>
                        <option value="шт">шт</option>
                        <option value="млн шт">млн шт</option>
                        <option value="м³">м³</option>
                        <option value="литр">литр</option>
                        <option value="метр">метр</option>
                        <option value="м²">м²</option>
                        <option value="млн долл. США">млн долл. США</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Годовая производственная мощность
                      </label>
                      <input
                        type="number"
                        value={formData.annualProductionCapacity}
                        onChange={(e) => setFormData({...formData, annualProductionCapacity: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Контактная информация</h2>
              </div>

              <div className="space-y-6">
                {/* Phone Numbers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номера телефонов
                  </label>
                  {formData.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => updateField('phoneNumbers', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+998 xx xxx xx xx"
                      />
                      {formData.phoneNumbers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeField('phoneNumbers', index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField('phoneNumbers')}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить номер
                  </Button>
                </div>

                {/* Email Addresses */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email адреса
                  </label>
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateField('emails', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="example@email.com"
                      />
                      {formData.emails.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeField('emails', index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField('emails')}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить email
                  </Button>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Местоположение</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <LocationSelect
                      label="Страна"
                      placeholder="Поиск страны..."
                      value={formData.country}
                      onSelect={handleLocationSelect}
                      showCountryOnly={true}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Почтовый код
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Полный адрес
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите полный адрес"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
