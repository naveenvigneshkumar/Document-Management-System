const express = require("express"), app = express();


const createServer = ()=>{

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
return app;
}

module.exports ={
    createServer
}