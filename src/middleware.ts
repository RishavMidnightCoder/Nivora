// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";
const SECRET_KEY = process.env.SECRET_KEY!; // must match FastAPI's SECRET_KEY

// Routes anyone can hit, logged in or not.
const PUBLIC_ROUTES = ["/", "/login", "/signup"];

// Routes that require a specific permission, mirroring the checks in
// Sidebar.tsx (usePermission). Any authenticated route NOT listed here
// just needs a valid session — no specific permission required.
const ROUTE_PERMISSIONS: { prefix: string; permission: string }[] = [
  { prefix: "/tasks", permission: "view_tasks" },
  { prefix: "/projects", permission: "view_projects" },
  { prefix: "/team", permission: "view_team_page" },
  { prefix: "/settings", permission: "view_settings" },
];

const secretKey = new TextEncoder().encode(SECRET_KEY);

async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
  if (payload.type !== "access") throw new Error("Invalid token type");
  return payload as { sub: string; jti: string; permissions?: string[] };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  // No access token at all, and nothing to refresh from -> not logged in.
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let permissions: string[] = [];
  let hasValidAccessToken = false;

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      permissions = payload.permissions ?? [];
      hasValidAccessToken = true;
    } catch {
      // Expired or tampered access token.
    }
  }

  // Access token missing/expired but a refresh token exists: let the
  // request through. Your gateway.ts interceptor / AuthListener flow
  // is responsible for calling /users/refresh and re-hydrating the
  // session; middleware can't safely mint new cookies mid-navigation.
  // We skip the permission check in this case rather than bounce the
  // user to /dashboard based on stale/no data.
  if (!hasValidAccessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const rule = ROUTE_PERMISSIONS.find((r) => pathname.startsWith(r.prefix));
  if (rule && !permissions.includes("*") && !permissions.includes(rule.permission)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - /api routes
     * - Next internals (_next/static, _next/image)
     * - static assets (favicon, images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};