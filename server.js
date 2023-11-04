const express = require('express');
const cors = require('cors');
require("dotenv").config()
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoService = require("./services/mongoServices");
const { appRouter } = require('./routes/appRouter');

const app = express()


// Helmet middleware for security headers
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         'data:',
//         'localhost',
//         'main-domain.com',
//         '*.main-domain.com',
//         '*.google.com',
//         '*.google.co.in',
//         '*.google-analytics.com',
//         '*.googlesyndication.com',
//         '*.googleadservices.com',
//         '*.googletagservices.com',
//         '*.googleapis.com',
//         '*.doubleclick.net',
//         '*.gstatic.com',
//         'youtu.be',
//         '*.youtu.be',
//         '*.youtube.com',
//       ],
//     },
//   },
// }));


// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

app.use("/",express.static('application'))


app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST',
  credentials: true, // Enable cookies and HTTP authentication
}))
app.use(express.json())
app.use(appRouter)
app.use(cookieParser()); // Add cookie-parser middleware

const port = process.env.PORT || 3000
app.listen(port,()=>{
  mongoService.initializeDB()
  console.log(`Server is live on :- http://localhost:${port}`);
})