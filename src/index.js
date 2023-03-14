// const express = require("express"), app = express();
const {createServer} = require('./app');
require("dotenv").config();
const mongoose = require('mongoose');
const StatusCodes = require('http-status-codes');

const authRouter = require('./routes/auth.route');
const reviewerRouter = require('./routes/review.route');
const adminRouter = require('./routes/admin.route');

const busboy = require('connect-busboy')

const app = createServer();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

let mongodbURL = process.env.TEST_SUIT == 'true' ? process.env.MONGO_DB_TEST : process.env.MONGO_DB

mongoose.connect(mongodbURL, {useNewUrlParser: true}).then((res)=>{
	console.log('connect on db',mongodbURL);
}).catch((err)=>{
	console.log(err);
});


app.get('/',async(req,res)=>{
    res.status(StatusCodes.OK).json({'start':'success'});
})

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

app.use('/v1/',authRouter);
app.use('/v1/review',reviewerRouter);
app.use('/v1/admin',adminRouter);

//setup server to listen on port
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is live on port ${process.env.PORT || 8000}`);
  })
