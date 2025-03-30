import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER!,
        pass: process.env.NODEMAILER_PASSWORD!
    }
});

export function mailOptions(to: string, subject: string, body: string) {
    const mailOptions = {
        from: process.env.NODEMAILER_USER!,
        to,
        subject,
        body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

