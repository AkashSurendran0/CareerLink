import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Cache for user status to avoid repeated API calls
const userStatusCache = new Map();

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Early return for public paths to avoid unnecessary processing
  const publicPaths = ['/login', '/signup', '/resetPassword', '/sessionOver', '/blocked'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Handle admin routes separately
  if (pathname.startsWith("/admin")) {
    return handleAdminRoutes(req, token, refreshToken, pathname);
  }

  // Handle token refresh logic
  if (!token && refreshToken) {
    const refreshResult = await handleTokenRefresh(req, refreshToken, 'token');
    if (refreshResult.redirect) return refreshResult.response;
  }

  // Public paths don't need authentication checks
  if (isPublicPath) {
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/resetPassword"))) {
      return NextResponse.redirect(new URL("/feed", req.url));
    }
    return NextResponse.next();
  }

  // If no token and not public path, redirect to sessionOver
  if (!token || !refreshToken) {
    return NextResponse.redirect(new URL("/sessionOver", req.url));
  }

  // Handle company routes with optimized checks
  if (pathname.startsWith('/company/')) {
    return handleCompanyRoutes(req, token, pathname);
  }

  if(pathname.startsWith('/becomeVip')) {
    return handleVipPage(req, token, pathname)
  }

  // Check user status only if needed (non-public, authenticated routes)
  const userCheckResult = await checkUserStatus(req, token, pathname);
  if (userCheckResult.redirect) {
    return userCheckResult.response;
  }

  return NextResponse.next();
}

// Helper functions for better organization and performance
async function handleAdminRoutes(req: NextRequest, token: string | undefined, refreshToken: string | undefined, pathname: string) {
  let isAdmin=false
  console.log(1)
  if (!token && refreshToken) {
    const refreshResult = await handleTokenRefresh(req, refreshToken, 'token');
    if (refreshResult.redirect) return refreshResult.response;
  }

  if (!token && !pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if(token){
    const result = await fetchWithCache(
      "http://localhost:5000/admin/v1/checkAdmin",
      token
    );
    console.log(result)
    isAdmin = result.result?.success == true;
    console.log(isAdmin)
    if(!isAdmin && !pathname.startsWith("/admin/login")){
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  
    if (isAdmin && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/userManagement", req.url));
    }
  }

  return NextResponse.next();
}

async function handleTokenRefresh(req: NextRequest, refreshToken: string, tokenName: string) {
  try {
    const { payload } = await jwtVerify(refreshToken, secret);
    const newToken = await new SignJWT({
      id: payload.id,
      email: payload.email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    const response = NextResponse.next();
    response.cookies.set({
      name: tokenName,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    });

    return { redirect: true, response };
  } catch (error) {
    console.log('Token refresh failed', error);
    return {
      redirect: true,
      response: NextResponse.redirect(new URL('/sessionOver', req.url))
    };
  }
}

async function handleCompanyRoutes(req: NextRequest, token: string, pathname: string) {
  try {
    const companyData = await fetchWithCache(
      "http://localhost:5000/company/v1/getCompanyRegistrationInfo",
      token
    );

    if (pathname.startsWith('/company/registrationPage') && companyData?.result?.success) {
      return NextResponse.redirect(new URL("/company/registeredCompany", req.url));
    }

    if (pathname.startsWith('/company/registeredCompany') && !companyData?.result?.success) {
      return NextResponse.redirect(new URL("/company/registrationPage", req.url));
    }
  } catch (err) {
    console.error("Company route middleware error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

async function handleVipPage(req:NextRequest, token:string, pathname:string) {
  const result = await fetchWithCache(
    "http://localhost:5000/subscription/v1/getSubscriptionInfo",
    token
  )

  const isVip=result?.result?.success

  if(isVip && pathname.startsWith('/becomeVip')){
    return NextResponse.redirect(new URL("/settings", req.url));
  }

  return NextResponse.next();
}

async function checkUserStatus(req: NextRequest, token: string, pathname: string) {
  // Skip check for paths that don't need it
  if (pathname.startsWith('/blocked') || 
      pathname.startsWith('/login') || 
      pathname.startsWith('/signup') || 
      pathname.startsWith('/resetPassword')) {
    return { redirect: false };
  }

  try {
    const userData = await fetchWithCache("http://localhost:5000/user/v1/check", token);
    
    if (userData?.result?.success) {
      return {
        redirect: true,
        response: NextResponse.redirect(new URL("/blocked", req.url))
      };
    }
  } catch (err) {
    console.error("User status check error:", err);
    return {
      redirect: true,
      response: NextResponse.redirect(new URL("/login", req.url))
    };
  }

  return { redirect: false };
}

// Cached fetch function to avoid duplicate API calls
async function fetchWithCache(url: string, token: string) {
  const cacheKey = `${url}:${token}`;
  
  if (userStatusCache.has(cacheKey)) {
    return userStatusCache.get(cacheKey);
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      'Cookie': `token=${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`API call failed: ${res.status}`);
  }

  const data = await res.json();
  
  // Cache for 30 seconds
  userStatusCache.set(cacheKey, data);
  setTimeout(() => userStatusCache.delete(cacheKey), 30000);

  return data;
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};