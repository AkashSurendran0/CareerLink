import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    if (!token) {
        if (
            !pathname.startsWith("/login") &&
            !pathname.startsWith("/signup") &&
            !pathname.startsWith("/resetPassword")
        ) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
            return NextResponse.next();
    }

    if (
            (pathname.startsWith("/login") ||
            pathname.startsWith("/signup") ||
            pathname.startsWith("/resetPassword")) &&
            token
        )   {
            return NextResponse.redirect(new URL("/feed", req.url));
    }

    if (!pathname.startsWith("/login") &&
        !pathname.startsWith("/signup") &&
        !pathname.startsWith("/resetPassword") &&
        !pathname.startsWith("/blocked") &&
        !pathname.startsWith("/admin")) {
    try {
      const res = await fetch("http://localhost:5000/user/check", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/blocked", req.url));
      }

      const data = await res.json();
      if (data.result.success) {
        return NextResponse.redirect(new URL("/blocked", req.url));
      }

    } catch (err) {
      console.error("Middleware fetch error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }


    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
