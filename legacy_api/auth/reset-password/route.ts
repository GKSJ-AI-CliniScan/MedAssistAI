import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin is not configured" }, { status: 500 });
    }

    // 1. Generate the reset link using Firebase Admin
    const resetLink = await adminAuth.generatePasswordResetLink(email, {
      // url: "http://localhost:6700/login", // Redirect after success if needed
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:6700/login",
    });

    // 2. Configure Nodemailer with Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // 3. Beautiful HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #F8FAFC;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            overflow: hidden;
            border: 1px solid #E2E8F0;
          }
          .header {
            background-color: #2563EB;
            padding: 40px 0;
            text-align: center;
          }
          .logo-container {
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            width: 64px;
            height: 64px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: 900;
            line-height: 1;
            letter-spacing: -1px;
            display: block;
          }
          .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px;
          }
          .content h2 {
            color: #0F172A;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .content p {
            color: #475569;
            font-size: 16px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .button {
            display: inline-block;
            background-color: #2563EB;
            color: #ffffff !important;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
          }
          .divider {
            height: 1px;
            background-color: #E2E8F0;
            margin: 32px 0;
          }
          .footer {
            text-align: center;
            padding-bottom: 32px;
          }
          .footer p {
            color: #94A3B8;
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
          }
          .footer-link {
            color: #64748B;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <span class="logo">M</span>
            </div>
            <h1>MedAssist AI</h1>
          </div>
          
          <div class="content">
            <h2>Secure Password Reset</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your MedAssist AI account associated with <strong>${email}</strong>.</p>
            <p>If you made this request, please click the secure button below to set a new password. This link will expire in a few hours for your safety.</p>
            
            <div class="button-container">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p style="font-size: 14px; color: #64748B; background: #F1F5F9; padding: 16px; border-radius: 12px; margin-bottom: 0;">
              If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MedAssist AI. All rights reserved.</p>
            <p>This is an automated security email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Send the Email
    await transporter.sendMail({
      from: '"MedAssist AI Security" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: "Reset your MedAssist AI password",
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Reset Password Error:", error);
    
    // Check for specific firebase admin errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: 'auth/user-not-found' }, { status: 404 });
    }
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'auth/invalid-email' }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
