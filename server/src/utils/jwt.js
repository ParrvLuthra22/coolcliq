import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES = '30d';

export function signUserToken(user) {
  return jwt.sign(
    { sub: user.id, handle: user.handle, role: 'user' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, role: admin.role, type: 'admin' },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Signed QR token — venues hand these out via printed QR codes.
// Format: { vid, jti, v }  signed with venue.qrSecret + version (cloning protection)
export function signQrPayload(venue) {
  return jwt.sign(
    { vid: venue.id, v: venue.qrVersion },
    venue.qrSecret,
    { expiresIn: '365d', jwtid: cryptoRandomId() }
  );
}

export function verifyQrPayload(token, venueSecret) {
  return jwt.verify(token, venueSecret);
}

function cryptoRandomId() {
  return [...crypto.getRandomValues(new Uint8Array(12))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}
