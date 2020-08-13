const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser  = require("cookie-parser")
const expressValidator = require("express-validator")
const fs = require("fs")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();

//dataBase
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => console.log("DataBase connected..!"))
mongoose.connection.on('Error', error => {
    console.log(error.message)
  })
  
//incoming imports
const postRoute = require("./routes/post")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

// apiDocs
app.get('/api', (req, res) => {
  fs.readFile('Docs/Api.docs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Origin', 'Contentgit -Type');
  next();
});
app.use("/api", postRoute)
app.use("/api", authRoute)
app.use("/api", userRoute)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error:'Unauthorized!...'});
    }
  })

//Server
const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{console.log(`API server is listening on port : ${PORT}`)})