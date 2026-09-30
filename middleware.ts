import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) { if (!request.cookies.get("session")?.value) { const loginPath = request.nextUrl.pathname.startsWith("/barber/") ? "/barber/login" : "/login"; return NextResponse.redirect(new URL(loginPath, request.url)); } return NextResponse.next(); }
export const config = { matcher: ["/dashboard/:path*", "/barber/dashboard/:path*"] };
