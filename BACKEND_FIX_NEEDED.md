# Backend SMS Service Fix Required

## Issue Summary
The frontend is working correctly and sending clean requests to `POST /api/auth/send-otp`. However, the backend server returns 401 because it fails to authenticate with the SMS service provider.

## Evidence
Console logs confirm:
- ✅ Frontend sends ONLY `Content-Type: application/json` header
- ✅ NO Authorization header sent from frontend
- ❌ Backend returns 401 with stack trace from `/home/oneport/1port-core`

## Error Details
```
AxiosError: Request failed with status code 401
at settle (/home/oneport/1port-core/node_modules/axios/lib/core/settle.js:19:12)
at IncomingMessage.handleStreamEnd (/home/oneport/1port-core/node_modules/axios/lib/adapters/http.js:599:11)
```

This indicates the backend is making an outbound HTTP request to an SMS service that's returning 401 Unauthorized.

## Required Backend Fix

### 1. Locate SMS Service Configuration
SSH into your backend server:
```bash
ssh user@api.1port.uz
cd /home/oneport/1port-core
```

### 2. Check Environment Variables
Look for SMS service credentials in your `.env` file:
```bash
cat .env | grep -i sms
cat .env | grep -i twilio
cat .env | grep -i playmobile
cat .env | grep -i api_key
```

### 3. Common SMS Service Variables
Check for these environment variables:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `SMS_API_KEY`
- `SMS_API_SECRET`
- `PLAYMOBILE_API_KEY`
- `PLAYMOBILE_USERNAME`
- `PLAYMOBILE_PASSWORD`
- Or similar credentials for your SMS provider

### 4. Verify SMS Service Code
Find the OTP sending implementation:
```bash
grep -r "send.*otp" src/ --include="*.js" --include="*.ts" -A 10
grep -r "sms" src/ --include="*.js" --include="*.ts" | grep -i api
```

### 5. Common Issues to Check

#### a) Missing or Invalid Credentials
- Ensure API key/secret are present in `.env`
- Verify credentials haven't expired
- Check if credentials are for production vs sandbox environment

#### b) Account Balance
- Many SMS providers return 401 when balance is $0
- Login to your SMS provider dashboard
- Check account balance and add funds if needed

#### c) IP Whitelist
- Some SMS providers restrict API access by IP address
- Check if your server IP is whitelisted
- Add server IP to allowed list in SMS provider dashboard

#### d) API Version/Endpoint
- Verify you're using the correct API endpoint URL
- Check if API version is still supported
- Review SMS provider's recent API changes

### 6. Test Backend Directly
Once fixed, test the backend endpoint directly:
```bash
curl -X POST https://api.1port.uz/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+998901234567"}'
```

Expected response:
```json
{"message": "OTP sent successfully"}
```

## Frontend Status
✅ Frontend is working correctly - no changes needed
✅ Clean requests with proper headers
✅ Good error handling in place

## Next Steps
1. Fix backend SMS service credentials
2. Test backend endpoint directly
3. Verify OTP delivery to phone
4. Frontend will work automatically once backend is fixed
