import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/admin")) {
    if (!adminToken && !pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (adminToken && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/userManagement", req.url));
    }

    return NextResponse.next();
  }


  if (!token) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/resetPassword")
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/resetPassword"))
  ) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (
    !pathname.startsWith("/blocked") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup") &&
    !pathname.startsWith("/resetPassword")
  ) {
    try {
      console.log(token)
      const res = await fetch("http://localhost:5000/user/v1/check", {
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

  if(pathname.startsWith('/company/registrationPage')){
    try {
      const res = await fetch("http://localhost:5000/company/v1/getCompanyRegistrationInfo", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data=await res.json()
      if(data.result.success){
        return NextResponse.redirect(new URL("/company/registeredCompany", req.url));
      }
    } catch (err) {
      console.error("Middleware fetch error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if(pathname.startsWith('/company/registeredCompany')){
    try {
      const res = await fetch("http://localhost:5000/company/v1/getCompanyRegistrationInfo", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data=await res.json()
      if(!data.result.success){
        return NextResponse.redirect(new URL("/company/registrationPage", req.url));
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
