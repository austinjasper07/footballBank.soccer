import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  try {
    console.log("🔍 Starting sendEmail to:", to);
    console.log("🔍 Resend API key exists:", !!process.env.RESEND_API_KEY);
    console.log("🔍 Resend API key length:", process.env.RESEND_API_KEY?.length || 0);
    console.log("🔍 Resend API key prefix:", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
    
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    if (!to || !subject) {
      throw new Error('Missing required email parameters: to and subject are required');
    }

    console.log("🔍 Attempting to send email with Resend API...");
    
    const { data, error } = await resend.emails.send({
      from: 'FootballBank.soccer <contact@footballbank.soccer>',
      to: [to],
      subject,
      html,
      text,
    });

    console.log("🔍 Resend response - data:", data, "error:", error);

    if (error) {
      console.error('🔍 Email sending error:', error);
      
      // Handle specific Resend API errors
      if (error.name === 'application_error') {
        throw new Error(`Resend API error: ${error.message}. This might be a network connectivity issue or API endpoint problem.`);
      } else if (error.name === 'validation_error') {
        throw new Error(`Email validation error: ${error.message}. Please check the email format and content.`);
      } else if (error.name === 'rate_limit_error') {
        throw new Error(`Rate limit exceeded: ${error.message}. Please try again later.`);
      } else {
        throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
      }
    }

    console.log("🔍 Email sent successfully with ID:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('🔍 Email service error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to Resend API. Please check your internet connection and try again.`);
    } else if (error.message.includes('API key')) {
      throw new Error(`Authentication error: Invalid or missing Resend API key. Please check your RESEND_API_KEY environment variable.`);
    } else {
      throw new Error(`Email service unavailable: ${error.message}`);
    }
  }
}

export function generateOTPEmailTemplate(otp, type) {
  const titles = {
    login: 'Login Verification Code',
    signup: 'Welcome to FootballBank.soccer',
    reset: 'Password Reset Code',
    verification: 'Email Verification Code'
  };

  const messages = {
    login: 'Use this code to complete your login:',
    signup: 'Welcome to FootballBank.soccer! Use this code to verify your email:',
    reset: 'Use this code to reset your password:',
    verification: 'Use this code to verify your email address:'
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${titles[type]}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-radius: 12px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        .otp-code {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 4px;
          margin: 30px 0;
          font-family: 'Courier New', monospace;
        }
        .message {
          font-size: 16px;
          margin-bottom: 20px;
          color: #4b5563;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FB</div>
          <h1 style="margin: 0; color: #1f2937;">${titles[type]}</h1>
        </div>
        
        <div class="message">
          ${messages[type]}
        </div>
        
        <div class="otp-code">${otp}</div>
        
        <div class="warning">
          <strong>Security Notice:</strong> This code will expire in 10 minutes. Do not share this code with anyone. FootballBank.soccer will never ask for your verification code.
        </div>
        
        <div class="footer">
          <p>If you didn't request this code, please ignore this email.</p>
          <p>© 2024 FootballBank.soccer. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendOTPEmail(email, otp, type) {
  try {
    console.log("🔍 Starting sendOTPEmail for:", email, "type:", type);
    
    const subject = type === 'signup' 
      ? 'Welcome to FootballBank.soccer - Verify Your Email'
      : `Your FootballBank.soccer ${type === 'login' ? 'Login' : type === 'reset' ? 'Password Reset' : 'Verification'} Code`;

    console.log("🔍 Email subject:", subject);

    const html = generateOTPEmailTemplate(otp, type);
    console.log("🔍 Email template generated");
    
    const result = await sendEmail({
      to: email,
      subject,
      html,
      text: `Your verification code is: ${otp}. This code expires in 10 minutes.`
    });
    
    console.log("🔍 Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("🔍 Error in sendOTPEmail:", error);
    console.error("🔍 Error stack:", error.stack);
    
    // Add fallback mechanism - you could implement alternative email services here
    console.log("🔍 Attempting fallback email service...");
    
    // For now, we'll just re-throw the error, but you could add:
    // - Alternative email service (SendGrid, Mailgun, etc.)
    // - SMS fallback
    // - Queue for retry later
    
    throw error;
  }
}
