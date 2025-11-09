# Email OTP Backend Configuration

The backend now sends one-time passwords over **email** (see `1port-core/src/controllers/auth.controller.ts`).  
If OTP delivery fails with 4xx/5xx responses, double-check the SMTP credentials instead of the old SMS gateway settings.

## Checklist

1. **Environment variables** – the backend expects:
   - `EMAIL_SMTP_HOST`
   - `EMAIL_SMTP_PORT`
   - `EMAIL_SMTP_SECURE` (`true`/`false`)
   - `EMAIL_USER`
   - `EMAIL_APP_PASSWORD`
   - `EMAIL_FROM` (optional display address)
2. **Nodemailer transport** – verify the credentials by running a local script or using `npm run dev` and hitting `POST /api/auth/otp/send` with `{ "email": "user@example.com" }`.
3. **Cooldown / attempts** – the API returns HTTP 429 with `retryAfter` seconds when users spam resend; surface this message in the client (already handled in the new login form).
4. **JWT secret** – keep `JWT_SECRET` configured; it's required during `verify` to mint the session token.

Once the SMTP credentials are valid, the new React login screen will collect an email address, accept a 6‑digit code, and store the JWT token exactly as before. No additional frontend changes are needed.***
