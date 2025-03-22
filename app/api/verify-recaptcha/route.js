import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      console.log("Token is missing");
      return NextResponse.json(
        { success: false, message: "Token is missing" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log("reCAPTCHA token:", token);
    console.log("reCAPTCHA secret key:", secretKey);
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verificationUrl, { method: "POST" });
    const data = await response.json();

    console.log("reCAPTCHA verification response:", data);

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
