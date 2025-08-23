import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  const isPublicRoute = ["/", "/sign-in", "/sign-up", "/home"].includes(path);
  const isVerifyRoute = path.startsWith("/verify/");

  if (isVerifyRoute) {
    return NextResponse.next();
  }

  if (path === "/" && !token) {
    return NextResponse.next();
  }

  if ((path === "/sign-in" || path === "/sign-up") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (path === "/home" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute && path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
