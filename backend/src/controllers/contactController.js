const { sendContactEmail } = require("../services/emailService");

exports.sendContact = async (req, res) => {

    try {

        const success = await sendContactEmail(req.body);

        if (!success) {

            return res.status(500).json({

                success: false,

                message: "Failed to send message."

            });

        }

        res.json({

            success: true,

            message: "Message sent successfully."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};