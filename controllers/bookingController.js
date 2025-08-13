const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, checkIn, checkOut, guests, bedrooms, message } =
      req.body;

    const newBooking = new Booking({
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      bedrooms,
      message,
    });

    await newBooking.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- Professional Email Template ---
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedCheckIn = new Date(checkIn).toLocaleDateString(
      "en-US",
      options
    );
    const formattedCheckOut = new Date(checkOut).toLocaleDateString(
      "en-US",
      options
    );

    // Email for customer confirmation
    const customerMailOptions = {
      from: `"Patrick's Court" <${process.env.EMAIL_USER}>`,
      to: email, // Customer's email
      subject: `Booking Confirmation - ${name}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 20px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #cccccc;">
                  
                  <tr>
                    <td align="center" style="padding: 40px 0 30px 0; background-color: #00466a; color: #ffffff;">
                      <img src="https://res.cloudinary.com/dn1jpokek/image/upload/v1753792454/FULAM-LOGO-WHITE-1-modified_izkiu1.png" alt="Your Company Logo" width="100" style="display: block;" />
                      <h1 style="margin: 20px 0 0 0;">Booking Request Confirmation</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333;">Hi ${name},</h2>
                      <p style="color: #555555; line-height: 1.6;">
                        Thank you for your booking! Your request has been received, and we are reviewing the details.
                      </p>
                      <p style="color: #555555; line-height: 1.6;">You will be notified once your booking is confirmed.</p>
                      <p style="color: #555555; line-height: 1.6;">Here are your booking details:</p>

                      <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #dddddd; margin-top: 20px;">
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Name:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${name}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Email:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${email}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Phone:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${phone}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Check-in Date:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${formattedCheckIn}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Check-out Date:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${formattedCheckOut}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Number of Guests:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${guests}</td>
                        </tr>
                         <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Bedrooms Required:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${bedrooms}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333; vertical-align: top;"><strong>Additional Message:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${
                            message || "No message provided."
                          }</td>
                        </tr>
                      </table>

                      <p style="margin-top: 30px; color: #555555; line-height: 1.6;">
                        If you have any immediate questions, feel free to reply directly to this email or call us at <a href="tel:+234 80 3698 4078" style="color: #00466a;">+234 80 3698 4078</a>.
                      </p>
                      <p style="color: #555555; line-height: 1.6;">We look forward to hosting you!</p>
                      <p style="color: #555555; line-height: 1.6; margin-top: 20px;">Best regards,<br/>The Team at <strong>Your Company Name</strong></p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px; background-color: #eeeeee; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #777777;">
                        &copy; ${new Date().getFullYear()} Patrick's Court. All rights reserved.<br/>
                        36A Bourdillon road,
                        Ikoyi, Lagos, Nigeria<br/>
                        <a href="https://patrickscourt.com" style="color: #00466a;">Visit our website</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    // Email for admin and additional recipients
    const adminMailOptions = {
      from: `"Patrick's Court" <${process.env.EMAIL_USER}>`,
      to: `${process.env.ADMIN2_EMAIL}, ${process.env.ADMIN_EMAIL},${process.env.ADMIN3_EMAIL}`, // Sends to both user and admin
      subject: `Booking Request Received - Confirmation for ${name}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 20px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #cccccc;">
                  
                  <tr>
                    <td align="center" style="padding: 40px 0 30px 0; background-color: #00466a; color: #ffffff;">
                      <img src="https://res.cloudinary.com/dn1jpokek/image/upload/v1753792454/FULAM-LOGO-WHITE-1-modified_izkiu1.png" alt="Your Company Logo" width="100" style="display: block;" />
                      <h1 style="margin: 20px 0 0 0;">Booking Request Received</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333;">Booking Details</h2>
                      <p style="color: #555555; line-height: 1.6;">Here are the details of the booking request:</p>

                      <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #dddddd; margin-top: 20px;">
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Name:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${name}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Email:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${email}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Phone:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${phone}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Check-in Date:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${formattedCheckIn}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Check-out Date:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${formattedCheckOut}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Guests:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${guests}</td>
                        </tr>
                         <tr style="background-color: #f9f9f9;">
                          <td style="border: 1px solid #dddddd; color: #333;"><strong>Bedrooms Required:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${bedrooms}</td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #dddddd; color: #333; vertical-align: top;"><strong>Additional Message:</strong></td>
                          <td style="border: 1px solid #dddddd; color: #555;">${
                            message || "No message provided."
                          }</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px; background-color: #eeeeee; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #777777;">
                        &copy; ${new Date().getFullYear()} Patrick's Court. All rights reserved.<br/>
                        36A Bourdillon road,
                        Ikoyi, Lagos, Nigeria<br/>
                        <a href="https://patrickscourt.com" style="color: #00466a;">Visit our website</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    // Send both customer and admin emails
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(201).json({
      success: true,
      message:
        "Booking created, confirmation email sent to customer and admin.",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating booking.",
    });
  }
};
