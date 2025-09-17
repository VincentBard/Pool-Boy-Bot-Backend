// This mock will bypass Auth0 and just inject a fake user identity
export default function mockAuth(req, res, next) {
  req.auth = {
    sub: "auth0|12345",
    "https://example.com/email": "testuser@example.com"
  };
  next();
}

