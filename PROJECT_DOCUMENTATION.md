# 1Port Web - React + Redux Toolkit + RTK Query Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Redux Toolkit & RTK Query Fundamentals](#redux-toolkit--rtk-query-fundamentals)
3. [Store Configuration](#store-configuration)
4. [API Layer with RTK Query](#api-layer-with-rtk-query)
5. [Component Integration](#component-integration)
6. [Type Safety with TypeScript](#type-safety-with-typescript)
7. [Best Practices Demonstrated](#best-practices-demonstrated)
8. [Code Examples & Patterns](#code-examples--patterns)

---

## Project Overview

This is a **cargo/logistics management system** built with:

- **React 18** + **TypeScript** - Frontend framework with type safety
- **Redux Toolkit (RTK)** - Modern Redux state management
- **RTK Query** - Powerful data fetching and caching solution
- **React Router** - Client-side routing
- **Redux Persist** - Persist Redux state to localStorage
- **Tailwind CSS** - Utility-first CSS framework

### 🏗️ Project Structure

```
src/
├── api/                    # RTK Query API definitions
│   ├── authApi.ts         # Authentication endpoints
│   ├── ordersApi.ts       # Orders CRUD operations
│   ├── profileApi.ts      # User profile management
│   ├── loadTypesApi.ts    # Load types data
│   └── loadPackagesApi.ts # Load packages data
├── store/
│   └── store.ts           # Redux store configuration
├── hooks/                 # Custom typed Redux hooks
│   ├── useAppDispatch.ts  # Typed dispatch hook
│   └── useAppSelector.ts  # Typed selector hook
├── components/            # React components
├── pages/                 # Page components
└── types/                 # TypeScript type definitions
```

---

## Redux Toolkit & RTK Query Fundamentals

### What is Redux Toolkit?

Redux Toolkit (RTK) is the **official, opinionated toolset** for efficient Redux development. It includes utilities that simplify common Redux patterns:

- **configureStore()** - Simplifies store setup
- **createSlice()** - Generates actions and reducers
- **createApi()** - RTK Query for data fetching

### What is RTK Query?

RTK Query is a **data fetching and caching solution** built on top of Redux Toolkit. It provides:

- ⚡ **Automatic caching** - Smart background refetching
- 🔄 **Cache invalidation** - Automatic UI updates
- 🚀 **Optimistic updates** - Instant UI feedback
- 📡 **Real-time subscriptions** - Live data updates
- 🎣 **Generated hooks** - Easy React integration

---

## Store Configuration

### 📁 `src/store/store.ts`

Let's break down the Redux store configuration:

```typescript
// Import Redux Toolkit essentials
import {
  configureStore, // Creates the Redux store
  createSlice, // Creates reducers and actions
  type PayloadAction, // TypeScript types
} from "@reduxjs/toolkit";

// Import Redux Persist for state persistence
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// Import all API slices
import { authApi } from "../api/authApi";
import { profilesApi } from "../api/profileApi";
import { ordersApi } from "../api/ordersApi";
import { loadTypesApi } from "../api/loadTypesApi";
import { loadPackagesApi } from "../api/loadPackagesApi";
```

### 🎯 Auth Token Slice (Traditional Redux)

```typescript
// Define the auth state interface
export interface AuthState {
  token: string | null;
}

// Create a slice for token management
const authTokenSlice = createSlice({
  name: "authToken", // Slice name
  initialState: { token: null } as AuthState,
  reducers: {
    // Action to set authentication token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    // Action to clear authentication token
    clearToken: (state) => {
      state.token = null;
    },
  },
});

// Export action creators
export const { setToken, clearToken } = authTokenSlice.actions;
```

### 🚪 Logout Thunk Action

```typescript
// Complete logout with cache clearing
export const logout = () => (dispatch: any) => {
  // 1. Clear authentication token
  dispatch(clearToken());

  // 2. Reset ALL RTK Query caches
  dispatch(authApi.util.resetApiState());
  dispatch(profilesApi.util.resetApiState());
  dispatch(ordersApi.util.resetApiState());
  dispatch(loadTypesApi.util.resetApiState());
  dispatch(loadPackagesApi.util.resetApiState());
};
```

### 💾 Redux Persist Configuration

```typescript
const persistConfig = {
  key: "authToken", // Key in localStorage
  storage, // Use localStorage
  whitelist: ["token"], // Only persist the token field
};

const persistedAuthReducer = persistReducer(
  persistConfig,
  authTokenSlice.reducer
);
```

### 🏪 Store Configuration

```typescript
export const store = configureStore({
  reducer: {
    // Traditional Redux slice
    authToken: persistedAuthReducer,

    // RTK Query API slices
    [authApi.reducerPath]: authApi.reducer,
    [profilesApi.reducerPath]: profilesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [loadTypesApi.reducerPath]: loadTypesApi.reducer,
    [loadPackagesApi.reducerPath]: loadPackagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for redux-persist
    }).concat(
      // Add RTK Query middleware for each API
      authApi.middleware,
      profilesApi.middleware,
      ordersApi.middleware,
      loadTypesApi.middleware,
      loadPackagesApi.middleware
    ),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## API Layer with RTK Query

### 🔐 Authentication API (`src/api/authApi.ts`)

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // Base URL for all endpoints
  }),
  endpoints: (builder) => ({
    // Mutation for sending OTP
    sendOtp: builder.mutation<
      { message: string }, // Response type
      { phone: string; language?: string } // Request type
    >({
      query: (body) => ({
        url: "auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    // Mutation for verifying OTP
    verifyOtp: builder.mutation<
      { token: string; user: { _id: string; phone: string } },
      { phone: string; otp: string }
    >({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export generated hooks
export const { useSendOtpMutation, useVerifyOtpMutation } = authApi;
```

### 📦 Orders API (`src/api/ordersApi.ts`)

The Orders API demonstrates **advanced RTK Query features**:

```typescript
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/orders`,
    // Automatic token injection
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  // 🏷️ Cache tags for invalidation
  tagTypes: ["Order", "MyOrders"],

  endpoints: (builder) => ({
    // 📖 Query endpoints (GET requests)
    getAllOrders: builder.query<Order[], void>({
      query: () => "/",
      providesTags: ["Order"], // Provides cache tags
    }),

    // Query with parameters
    filterOrders: builder.query<Order[], OrdersFilterParams>({
      query: (params) => ({
        url: "/filter",
        params, // URL search parameters
      }),
      providesTags: ["Order"],
    }),

    // Dynamic query with ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: "Order", id }],
    }),

    // ✏️ Mutation endpoints (POST/PUT/DELETE)
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      // Invalidate cache to trigger refetch
      invalidatesTags: ["Order", "MyOrders"],
    }),

    updateOrder: builder.mutation<
      Order,
      { id: string; updates: Partial<Order> }
    >({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      // Invalidate specific tags
      invalidatesTags: (_, __, { id }) => [
        "Order",
        "MyOrders",
        { type: "Order", id },
      ],
    }),
  }),
});
```

### 👤 Profile API (`src/api/profileApi.ts`)

```typescript
export const profilesApi = createApi({
  reducerPath: "profilesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).authToken?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Get current user's profile
    getMyProfile: builder.query<Profile, void>({
      query: () => "profiles/me",
      providesTags: ["Profile"],
    }),

    // Get profile by user ID
    getProfileByUserId: builder.query<Profile, string>({
      query: (userId) => `profiles/by-user-id/${userId}`,
      providesTags: (_, __, userId) => [{ type: "Profile", id: userId }],
    }),

    // Create new profile
    createProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (body) => ({
        url: "profiles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});
```

---

## Component Integration

### 🎣 Custom Typed Hooks

#### `src/hooks/useAppDispatch.ts`

```typescript
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

#### `src/hooks/useAppSelector.ts`

```typescript
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../store/store";

// Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 🔐 Login Component (`src/pages/Login.tsx`)

```typescript
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // RTK Query mutations with loading states
  const [sendOtp, { isLoading: sendingOtp, error: sendError }] =
    useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp, error: verifyError }] =
    useVerifyOtpMutation();

  const handleSendOtp = async () => {
    const result = await sendOtp({ phone });
    if ("data" in result) setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const result = await verifyOtp({ phone, otp });
    if ("data" in result) {
      // Store token in Redux
      dispatch(setToken(result.data?.token || ""));
      navigate("/");
    }
  };

  return (
    <div>
      {/* UI with loading states and error handling */}
      <button onClick={handleSendOtp}>
        {sendingOtp ? "Отправка..." : "Отправить OTP"}
      </button>
      {sendError && <p>Ошибка при отправке OTP</p>}
    </div>
  );
}
```

### 📊 Orders Table Component (`src/components/tables/OrdersTable.tsx`)

This component demonstrates **multiple RTK Query patterns**:

```typescript
const OrdersTable: React.FC = () => {
  // Main data query
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  // Loading state
  if (isLoading) {
    return <div>Loading skeleton...</div>;
  }

  // Error state
  if (error) {
    return <div>Error loading orders...</div>;
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return <div>No orders found...</div>;
  }

  return (
    <table>
      {orders.map((order) => (
        <OrderRow key={order._id} order={order} />
      ))}
    </table>
  );
};
```

### 🔗 Nested Data Loading Pattern

```typescript
// Component that loads related data
const LoadTypeName: React.FC<{ loadType?: Order["loadType"] }> = ({
  loadType,
}) => {
  // Conditional query - only runs if loadType is a string ID
  const { data: loadTypeData } = useGetLoadTypeByIdQuery(loadType as string, {
    skip: !loadType || typeof loadType !== "string",
  });

  if (!loadType) return <span>Не указан</span>;

  // Handle both populated objects and IDs
  if (typeof loadType === "object") {
    return <span>{getLocalizedText(loadType.name)}</span>;
  }

  if (typeof loadType === "string" && loadTypeData) {
    return <span>{getLocalizedText(loadTypeData.name)}</span>;
  }

  return <span>{loadType}</span>;
};
```

---

## Type Safety with TypeScript

### 🎯 Order Model (`src/types/models/cargoOwner/order.ts`)

```typescript
// Internationalization support
export interface LocalizedString {
  ru?: string;
  en?: string;
  uz?: string;
  kz?: string;
  kaa?: string;
}

// Complex order model with union types
export interface Order {
  _id?: string;
  loadName: string;

  // Union types for populated/unpopulated references
  loadType?:
    | string
    | {
        _id: string;
        name: LocalizedString;
        __v?: number;
      };

  // Nested objects
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  // Enums
  bid: "yes" | "ask";
  weightUnit: "kg" | "ton";

  // Complex nested types
  loadStatus: {
    state: "ready_from" | "always" | "not_ready";
    readyFrom?: Date;
    interval?: "every_day" | "in_working_days" | "every_month";
  };

  // Optional complex objects
  pricing?: {
    withVat: number;
    withoutVat: number;
    pricingType: string;
  };

  // Union types for owner (can be ID or populated object)
  owner:
    | string
    | {
        _id: string;
        phone?: string;
        fullName?: string;
      };
}
```

---

## Best Practices Demonstrated

### 1. 🏷️ **Cache Management with Tags**

```typescript
// Provide tags for caching
providesTags: ["Order"];
providesTags: (result, error, id) => [{ type: "Order", id }];

// Invalidate tags for updates
invalidatesTags: ["Order", "MyOrders"];
invalidatesTags: (result, error, { id }) => ["Order", { type: "Order", id }];
```

### 2. 🔒 **Automatic Authentication**

```typescript
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as any).authToken?.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};
```

### 3. ⏭️ **Conditional Queries**

```typescript
const { data } = useGetLoadTypeByIdQuery(loadType as string, {
  skip: !loadType || typeof loadType !== "string",
});
```

### 4. 🎯 **Type-Safe Hooks**

```typescript
// Custom typed hooks prevent type errors
const dispatch = useAppDispatch(); // Typed dispatch
const token = useAppSelector((state) => state.authToken.token); // Typed selector
```

### 5. 🚿 **Complete Logout with Cache Clearing**

```typescript
export const logout = () => (dispatch: any) => {
  dispatch(clearToken());
  // Clear ALL API caches
  dispatch(authApi.util.resetApiState());
  dispatch(profilesApi.util.resetApiState());
  // ... more API resets
};
```

### 6. 💾 **Selective Persistence**

```typescript
const persistConfig = {
  key: "authToken",
  storage,
  whitelist: ["token"], // Only persist token, not other sensitive data
};
```

---

## Code Examples & Patterns

### 🔄 **Mutation with Optimistic Updates**

```typescript
const [updateOrder] = useUpdateOrderMutation();

const handleUpdateOrder = async (id: string, updates: Partial<Order>) => {
  try {
    await updateOrder({ id, updates }).unwrap();
    // Success feedback
  } catch (error) {
    // Error handling
  }
};
```

### 📡 **Query with Parameters**

```typescript
const [filters, setFilters] = useState<OrdersFilterParams>({});

const {
  data: filteredOrders,
  isLoading,
  error,
} = useFilterOrdersQuery(filters, {
  skip: Object.keys(filters).length === 0, // Skip if no filters
});
```

### 🔄 **Manual Cache Invalidation**

```typescript
const dispatch = useAppDispatch();

const handleManualRefresh = () => {
  dispatch(ordersApi.util.invalidateTags(["Order"]));
};
```

### 🎯 **Loading States Pattern**

```typescript
const { data, isLoading, error, isSuccess } = useGetOrdersQuery();

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
if (isSuccess && data.length === 0) return <EmptyState />;
return <OrdersList orders={data} />;
```

---

## 🎓 Learning Takeaways

### Redux Toolkit Benefits:

1. **Less Boilerplate** - `createSlice` generates actions and reducers
2. **Immutable Updates** - Uses Immer under the hood
3. **Better DevTools** - Enhanced debugging experience
4. **Type Safety** - Excellent TypeScript support

### RTK Query Benefits:

1. **Automatic Caching** - Smart background refetching
2. **Generated Hooks** - Easy React integration
3. **Cache Invalidation** - Automatic UI updates
4. **Loading States** - Built-in loading/error handling
5. **Optimistic Updates** - Better user experience

### Key Patterns in This Project:

- ✅ **API Slice per Domain** (auth, orders, profiles)
- ✅ **Typed Hooks** for type safety
- ✅ **Conditional Queries** for optimization
- ✅ **Cache Tag Management** for updates
- ✅ **Authentication Integration**
- ✅ **Error Boundary** for error handling
- ✅ **Persistence** for offline support

This project demonstrates a **production-ready** approach to building React applications with Redux Toolkit and RTK Query! 🚀
