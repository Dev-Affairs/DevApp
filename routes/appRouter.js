const { login } = require("../controllers/loginController")
const {register} = require("../middleware/verifyRegistration")
const { generateOTP, verifyOTP } = require("../services/OTPServices")
const { refresh } = require("../controllers/refreshTokenController")
const appRouter = require("express").Router()

appRouter.post("/api/generate-otp",register,generateOTP)
appRouter.post("/api/login",login)
appRouter.post("/api/verify-otp",verifyOTP)
appRouter.post("/api/refresh",refresh)


module.exports = {appRouter}