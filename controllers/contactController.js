// controllers/contactController.js
const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Styled HTML email to admin
    const adminMailOptions = {
      from: `"Patrick's Court Contact Form" <${process.env.EMAIL_USER}>`,
      to: `${process.env.ADMIN_EMAIL}, ${process.env.ADMIN2_EMAIL}, ${process.env.ADMIN3_EMAIL}`,
      subject: `[Contact Form] ${subject} - From ${name}`,
      html: `
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:20px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                  style="border-collapse:collapse; background-color:#ffffff; border:1px solid #cccccc;">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding:40px 0 30px 0; background-color:#00466a; color:#ffffff;">
                      <img src="https://res.cloudinary.com/dn1jpokek/image/upload/v1753792454/FULAM-LOGO-WHITE-1-modified_izkiu1.png" 
                           alt="Patrick's Court Logo" width="100" style="display:block;" />
                      <h1 style="margin:20px 0 0 0;">New Contact Message</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 30px;">
                      <h2 style="color:#333333; margin-top:0;">Message Details</h2>
                      <p style="color:#555555; line-height:1.6;">Here’s the information submitted from the contact form:</p>

                      <table border="0" cellpadding="10" cellspacing="0" width="100%" 
                        style="border-collapse:collapse; border:1px solid #dddddd; margin-top:20px;">
                        
                        <tr style="background-color:#f9f9f9;">
                          <td style="border:1px solid #dddddd; color:#333;"><strong>Name:</strong></td>
                          <td style="border:1px solid #dddddd; color:#555;">${name}</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #dddddd; color:#333;"><strong>Email:</strong></td>
                          <td style="border:1px solid #dddddd; color:#555;">${email}</td>
                        </tr>
                        <tr style="background-color:#f9f9f9;">
                          <td style="border:1px solid #dddddd; color:#333;"><strong>Phone:</strong></td>
                          <td style="border:1px solid #dddddd; color:#555;">${
                            phone || "Not provided"
                          }</td>
                        </tr>
                        <tr>
                          <td style="border:1px solid #dddddd; color:#333;"><strong>Subject:</strong></td>
                          <td style="border:1px solid #dddddd; color:#555;">${subject}</td>
                        </tr>
                        <tr style="background-color:#f9f9f9;">
                          <td style="border:1px solid #dddddd; color:#333; vertical-align:top;"><strong>Message:</strong></td>
                          <td style="border:1px solid #dddddd; color:#555;">${message}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:30px; background-color:#eeeeee; text-align:center;">
                      <p style="margin:0; font-size:12px; color:#777777;">
                        &copy; ${new Date().getFullYear()} Patrick's Court. All rights reserved.<br/>
                        36A Bourdillon road, Ikoyi, Lagos, Nigeria<br/>
                        <a href="https://patrickscourt.com" style="color:#00466a;">Visit our website</a>
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

    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};
