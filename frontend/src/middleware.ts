import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";
const secret=new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req: NextRequest, res:NextResponse) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value
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

  if(!token && refreshToken){
    try {
      const {payload}=await jwtVerify(refreshToken, secret)
      const newToken=await new SignJWT({
        id:payload.id,
        email:payload.email
      })
      .setProtectedHeader({alg:'HS256'})
      .setExpirationTime('1h')
      .sign(secret)
  
      const response = NextResponse.next()
      response.cookies.set({
        name: 'token',
        value: newToken,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      })
  
      return response
    } catch (error: any) {
      console.log('Token refresh failed', error)
      return NextResponse.redirect(new URL('/sessionOver', req.url))
    }
  }

  if (!token || !refreshToken) {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/resetPassword") ||
      pathname.startsWith("/sessionOver")
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/sessionOver", req.url));
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
        credentials: 'include',
        headers:{
          'Cookie':`token=${token}`
        }
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/blocked", req.url));
      }

      const data = await res.json();
      console.log('aaaaaaaa', data)
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
        credentials: 'include',
        headers:{
          'Cookie':`token=${token}`
        }
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
        credentials: 'include',
        headers:{
          'Cookie':`token=${token}`
        }
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
