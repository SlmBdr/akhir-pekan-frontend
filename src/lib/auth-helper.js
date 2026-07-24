import { cookies } from 'next/headers';
import { AuthService } from './services/auth.service';

export async function verifyAdmin(request) {
  let token = null;

  // 1. Try fetching from cookie
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (tokenCookie) {
      token = tokenCookie.value;
    }
  } catch (err) {
    // cookies() might fail in some contexts, fallback to header
  }

  // 2. Try fetching from Authorization header
  if (!token && request && request.headers) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const [type, credentials] = authHeader.split(' ');
      if (type === 'Bearer') {
        token = credentials;
      }
    }
  }

  if (!token) {
    return null;
  }

  const result = await AuthService.verifyToken(token);
  if (result.success) {
    return result.admin;
  }
  return null;
}
