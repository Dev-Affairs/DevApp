const speakeasy = require("speakeasy");
const winston = require("winston");
const { updateOne, findOne } = require("./mongoServices");
const { sendMail } = require("./nodeMailer");
const OTP_Expitation = 180; //180 seconds = 3 minutes

// Configure logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "otp-verification" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

// Endpoint to generate and send an OTP to the user
const generateOTP = async (req, res) => {
  try {
    const userId = req.body.email;

    // Generate a secret for the user
    console.log(userId);
    const secret = speakeasy.generateSecret();
    // Save the user data in the database
    await updateOne(
      "user",
      { email: userId },
      { $set: { secret: secret.base32 } },
      { upsert: true }
    );
    // Generate an OTP for the user
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
      step: OTP_Expitation,
    });

    // Send the OTP to the user (you would typically send it via email, SMS, etc.)
    sendMail(otp, userId);
    console.log(`Generated OTP for user ${userId}: ${otp}`);
    res
      .status(201)
      .json({
        message:
          "registration successful please check your mail to verify your account",
      });
  } catch (error) {
    logger.error(`Error generating OTP: ${error.message}`);
    res.status(500).send("Internal Server Error");
    console.log(error.message);
  }
};

// verify otp
const verifyOTP = async (req, res) => {
  try {
    const userId = req.body.userData.email;
    const userOTP = req.body.userData.otp;
    console.log(req.body);
    console.log(userId, userOTP);
    // Retrieve the user data from the database
    const user = await findOne("user", { email: userId });

    if (!user) {
      return res.status(400).json({ error: "User not found or OTP expired." });
    }

    // Verify the OTP
    const isValid = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: userOTP,
      step: 180,
      window: 1,
    });

    if (isValid) {
      return res.status(201).json({ message: "OTP is valid. User verified." });
    } else {
      return res
        .status(401)
        .json({ error: "Invalid OTP. User verification failed." });
    }
  } catch (error) {
    logger.error(`Error verifying OTP: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { generateOTP, verifyOTP };
