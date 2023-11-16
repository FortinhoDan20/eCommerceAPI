const express = require("express");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const colors = require('colors')
const morgan = require('morgan')
require("dotenv").config();

const app = express();
const connectDB = require("./db/mongoose");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

connectDB();

const port = process.env.PORT;

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(errorHandler)
//app.use(notFound)

app.use("/api-user", require("./routes/auth"));
app.use('/api-product', require('./routes/product'))
app.use('/api-blog', require('./routes/blog'))
app.use('/api-category', require('./routes/category'))
app.use('/api-category-prod', require('./routes/categoryProd'))
app.use('/api-enquiry', require('./routes/enq'))
app.use('/api-coupon', require('./routes/coupon'))
app.use('/api-color', require('./routes/color'))

app.listen(port, () => {
  console.log(`Server is running at PORT ${port}`);
});
