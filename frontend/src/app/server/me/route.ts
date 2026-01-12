import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  email: string;
  id: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log("Token in /server/me route:", token);
  if (!token) {
    return Response.json({ userEmail: null }, { status: 401 });
  }

  try {
    console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log("Decoded token in /server/me route:", decoded);
    return Response.json({ userEmail: decoded.email, userId: decoded.id });
  } catch (error) {
    return Response.json({ userEmail: null }, { status: 401 });
  }
}
