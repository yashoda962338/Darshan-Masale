const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: process.env.SMTP_PORT,

    secure: false,

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASS

    }

});

exports.sendContactEmail = async ({
    name,
    email,
    phone,
    subject,
    message
}) => {

    await transporter.sendMail({

        from: `"Darshan Masale Website" <${process.env.SMTP_USER}>`,

        to: "darshankhairnar381@gmail.com",

        subject: `New Contact Form - ${subject}`,

        html: `

        <div style="font-family:Arial;padding:20px">

        <h2>📩 New Contact Form Submission</h2>

        <hr>

        <p><b>Name:</b> ${name}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Phone:</b> ${phone || "-"}</p>

        <p><b>Subject:</b> ${subject}</p>

        <p><b>Message:</b></p>

        <p>${message}</p>

        <hr>

        <small>
        Sent from Darshan Masale Website
        </small>

        </div>

        `

    });

};