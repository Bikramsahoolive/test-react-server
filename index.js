const express = require('express');
const cors = require('cors');
const session  = require('express-session');


const app = express();

const UserRouter = require('./src/router/userRouts');



app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'sessionsecret',
    resave:false,
    saveUninitialized:true,
    cookie: {
        secure: true
      }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit:'10mb'}));

app.get('/',(req,res)=>{
    
    req.session.data = "session_data"
    res.send('React Backend running.');
})

app.get('/sess',(req,res)=>{
    res.send(req.session.data);
})
app.use('/api',UserRouter);

app.listen(3300,()=>console.log('app running on port 3300'))