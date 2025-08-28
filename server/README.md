Local Stripe test server for READU Interactive.

Endpoints
- POST /paymentsheet: Creates/retrieves a Stripe Customer, Ephemeral Key, and PaymentIntent. Returns client secrets for PaymentSheet.
- POST /webhook: Stripe webhook receiver (set your endpoint in the Stripe dashboard).

Setup
1) Create server/.env from server/.env.example and fill values.
2) In server/, run: npm i express cors stripe dotenv
3) Start: node index.js (or nodemon index.js)

Client flow (PaymentSheet)
1) Call POST /paymentsheet with body { userId, email, plan }. Server responds with { paymentIntent, ephemeralKey, customerId }.
2) Use @stripe/stripe-react-native with your publishable key to initialize, then present PaymentSheet with the client secret.
3) On success, mark the user as subscribed in your store/Firestore.

Security
- Never expose the Stripe secret key to the client app; keep it in server/.env.
- Use your backend/webhooks to keep the user subscription status authoritative.

