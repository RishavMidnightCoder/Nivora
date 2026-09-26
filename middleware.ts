import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Middleware runs on the edge and has no access to your Redux store,
// so it reads permissions straight out of the JWT (put there at login,
// same payload as src/utils/helper.py -> create_access_token).
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Map route prefixes to the permission required to enter them.
// Roles/Members live as tabs inside /team, not as separate routes —
// /team itself is gated by view_team_page; the tabs inside it are
// gated client-side by view_members / view_roles (see Team.tsx).
const ROUTE_PERMISSIONS: Record<string, string> = {
  "/tasks": "view_tasks",
  "/projects": "view_projects",
  "/team": "view_team_page",
  "/settings": "view_settings",
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(([prefix]) =>
    pathname.startsWith(prefix)
  )?.[1];

  if (!requiredPermission) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const permissions = (payload.permissions as string[]) ?? [];

    if (!permissions.includes(requiredPermission) && !permissions.includes("*")) {
      // Route-jumping to a page you're not permitted to view bounces
      // you back to the dashboard rather than an /unauthorized page.
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/projects/:path*", "/team/:path*", "/settings/:path*"],
};

// Remember: this only gates page navigation. Every API call must still
// pass through require_permission() on the FastAPI side — middleware
// here is a UX convenience, not the security boundary.