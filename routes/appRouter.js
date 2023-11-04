const { login } = require("../controllers/loginController")
const { register } = require("../controllers/registerController")
const appRouter = require("express").Router()

appRouter.post("/api/register",register)
appRouter.post("/api/login",login)

module.exports = {appRouter}