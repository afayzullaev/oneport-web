import React from "react";
import { useSearchExportersQuery, type Profile } from "@/api/profileApi";
import { useLocalization } from "@/hooks/useLocalization";
import { Download } from "lucide-react";

const ExportersTable: React.FC = () => {
  const { t } = useLocalization();

  // Get exporters data
  const {
    data: exporters,
    isLoading,
    error,
    refetch,
  } = useSearchExportersQuery({
    limit: 0,
    offset: 0,
  });

  const formatCapacity = (capacity?: number, unit?: string) => {
    if (!capacity) return t.common.notSpecified;
    return `${capacity.toLocaleString()} ${unit || ""}`;
  };

  const formatContacts = (exporter: Profile) => {
    const contacts = [];
    if (exporter.phoneNumbers?.length) {
      contacts.push(...exporter.phoneNumbers);
    }
    if (exporter.emails?.length) {
      contacts.push(...exporter.emails);
    }
    return contacts.slice(0, 2); // Show max 2 contacts to keep UI clean
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    if (!exporters || exporters.length === 0) return;

    // Create CSV content
    const headers = [
      'Company Name',
      'TIN',
      'Representative',
      'Activity Type',
      'Goods',
      'Annual Capacity',
      'Unit',
      'Country',
      'Phone Numbers',
      'Emails'
    ];

    const csvContent = [
      headers.join(','),
      ...exporters.map(exporter => [
        `"${exporter.companyName || ''}"`,
        `"${exporter.companyTIN || ''}"`,
        `"${exporter.representativeFullname || ''}"`,
        `"${exporter.activityType || ''}"`,
        `"${exporter.goods?.join('; ') || ''}"`,
        exporter.annualProductionCapacity || '',
        `"${exporter.unit || ''}"`,
        `"${exporter.country || ''}"`,
        `"${exporter.phoneNumbers?.join('; ') || ''}"`,
        `"${exporter.emails?.join('; ') || ''}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exporters_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">{t.common.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg
className="w-16 h-16 mx-auto mb-4"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
            <path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.exportersCatalog.error.title}</h3>
        <p className="text-gray-600 mb-6">{t.exportersCatalog.error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.exportersCatalog.search.searchButton}
        </button>
      </div>
    );
  }

  if (exporters?.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
className="w-16 h-16 mx-auto mb-4"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
            <path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={1}
d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.exportersCatalog.empty.title}</h3>
        <p className="text-gray-600">{t.exportersCatalog.empty.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t.exportersCatalog.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t.exportersCatalog.subtitle}
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          disabled={!exporters || exporters.length === 0}
        >
          <Download size={16} />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div>
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                {t.exportersCatalog.table.headers.company}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">
                {t.exportersCatalog.table.headers.activity}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                {t.exportersCatalog.table.headers.goods}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                {t.exportersCatalog.table.headers.capacity}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                {t.exportersCatalog.table.headers.country}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                {t.exportersCatalog.table.headers.contacts}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exporters?.map((exporter) => (
              <tr
key={exporter._id}
className="hover:bg-gray-50">
                {/* Company Info */}
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 break-words">
                      {exporter.companyName || t.common.notSpecified}
                    </div>
                    {exporter.companyTIN && (
                      <div className="text-sm text-gray-500">
                        {t.exportersCatalog.table.headers.tin}: {exporter.companyTIN}
                      </div>
                    )}
                    {exporter.representativeFullname && (
                      <div className="text-sm text-blue-600 font-medium break-words">
                        {exporter.representativeFullname}
                      </div>
                    )}
                  </div>
                </td>

                {/* Activity - with line clamp for max 3 rows */}
                <td className="px-6 py-4">
                  <div
className="text-sm text-gray-900 break-words"
style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxHeight: '4.5rem',
                    lineHeight: '1.5rem'
                  }}>
                    {exporter.activityType || t.common.notSpecified}
                  </div>
                </td>

                {/* Goods */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {exporter.goods && exporter.goods.length > 0 ? (
                      exporter.goods.slice(0, 3).map((good, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 break-words"
                        >
                          {good}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">{t.common.notSpecified}</span>
                    )}
                    {exporter.goods && exporter.goods.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{exporter.goods.length - 3} еще
                      </span>
                    )}
                  </div>
                </td>

                {/* Capacity */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 break-words">
                    {formatCapacity(exporter.annualProductionCapacity, exporter.unit)}
                  </div>
                </td>

                {/* Country */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 break-words">
                      {exporter.country || t.common.notSpecified}
                    </span>
                    {exporter.isVerified && (
                      <svg
className="w-4 h-4 text-green-500 ml-2 flex-shrink-0"
fill="currentColor"
viewBox="0 0 20 20">
                        <path
fillRule="evenodd"
d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </td>

                {/* Contacts */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {formatContacts(exporter).map((contact, index) => (
                      <div
key={index}
className="text-sm break-words">
                        {contact.includes("@") ? (
                          <a
                            href={`mailto:${contact}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {contact}
                          </a>
                        ) : (
                          <a
                            href={`tel:${contact}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {contact}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          {t.ordersTable.summary} <span className="font-medium">{exporters?.length}</span> {exporters?.length === 1 ? 'экспортер' : 'экспортеров'}
        </p>
      </div>
    </div>
  );
};

export default ExportersTable;
