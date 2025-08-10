import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/constants/config';
import type { RootState } from '@/store/store';

export interface LocationResult {
  place_id: string;
  display_name: string;
  display_place: string;
  display_address: string;
  lat: string;
  lon: string;
  country?: string;
  boundingbox: [string, string, string, string];
  class: string;
  type: string;
  licence: string;
  osm_id: string;
  osm_type: string;
  address: {
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
}

export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authToken?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchLocations: builder.query<LocationResult[], string>({
      query: (query) => ({
        url: '/search',
        params: { q: query },
      }),
      // Cache for 5 minutes to avoid excessive API calls
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useSearchLocationsQuery, useLazySearchLocationsQuery } = locationApi;
