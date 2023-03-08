const express = require("express"), app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const StatusCodes = require('http-status-codes');

const authRouter = require('./routes/auth.route');
const reviewerRouter = require('./routes/review.route');
const busboy = require('connect-busboy')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true}).then((res)=>{
	console.log('connect on db');
}).catch((err)=>{
	console.log(err);
});

app.get('/',(req,res)=>{
    res.status(StatusCodes.OK).json({'start':'success'});
})

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

app.use('/v1/',authRouter);
app.use('/v1/review',reviewerRouter);

//setup server to listen on port
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is live on port ${process.env.PORT || 8000}`);
  })
