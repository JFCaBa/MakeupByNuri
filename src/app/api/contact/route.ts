import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son obligatorios' },
        { status: 400 }
      );
    }

    // Dynamically import nodemailer
    const nodemailer = (await import('nodemailer')).default;

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'ssl0.ovh.net',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      // Additional options for OVH server
      tls: {
        rejectUnauthorized: false, // May need to set to false for some self-signed certificates
      },
    });

    // Verify connection configuration (optional in some contexts)
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.warn('Could not verify transporter configuration:', verifyError.message);
      // Continue anyway as some environments may not allow verification
    }

    // Prepare mail options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'info@makeupbynuri.com',
      to: process.env.CONTACT_EMAIL || 'info@makeupbynuri.com',
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Add CC if the environment variable is set
    if (process.env.CC_EMAIL) {
      mailOptions.cc = process.env.CC_EMAIL;
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { error: 'Error al enviar el mensaje: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}