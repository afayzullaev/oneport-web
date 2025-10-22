# Orders Filter Bug - FIXED ✅

## Problem
The unload/load country filters were not working because the frontend sent `country_code` (e.g., "kg") but the backend searches in the `country` field (e.g., "Kyrgyzstan").

## Solution Applied

Changed [src/components/filters/OrdersFilter.tsx](src/components/filters/OrdersFilter.tsx) line 40 from:
```typescript
const countryCode = location?.address?.country_code || "";  // ❌ Wrong
```

To:
```typescript
const countryName = location?.address?.country || "";  // ✅ Correct
```

## Result
- ✅ Frontend now sends full country name (e.g., "Kyrgyzstan")
- ✅ Backend searches `unloadAddress.country` field correctly
- ✅ Filter now works as expected
- ✅ Build successful

## Deploy
```bash
npm run build
# Deploy dist/ folder
```
