import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code - LongWeekends",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code - LongWeekends</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 20px auto; background: #ffffff; border-radius: 8px;
                         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { background:rgb(0, 119, 255); color: #ffffff; text-align: center; padding: 20px; 
                      font-size: 22px; font-weight: bold; }
            .content { padding: 20px; text-align: center; color: #333333; }
            .otp { font-size: 24px; font-weight: bold; color: rgb(0, 119, 255); background: #f8f8f8;
                   padding: 10px 20px; display: inline-block; border-radius: 5px; margin-top: 10px; }
            .footer { background: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; 
                      color: #777777; }
            .footer a { color: rgb(0, 119, 255); text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                LongWeekends
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) for verification is:</p>
                <p class="otp">${otp}</p>
                <p>This code is valid for only 1 minute. Please do not share it with anyone.</p>
            </div>
            <div class="footer">
                &copy; 2025 LongWeekends. All rights reserved. <br>
                Need help? <a href="mailto:support@longweekends.com">Contact Support</a>
            </div>
        </div>
    </body>
    </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const generateAndSendOtp = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        isEmailVerified: false,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 2 minutes

    await prisma.oTP.upsert({
      where: { email },
      update: { otp: hashedOTP, expiresAt },
      create: { email, otp: hashedOTP, expiresAt },
    });

    // Send OTP to user's email
    await sendEmail(email, otp);

    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("Error generating or sending OTP:", error);
    return { success: false, message: "Error generating or sending OTP" };
  }
};
