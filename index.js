const express = require('express');
const cors = require('cors');
const app = express();

const UserRouter = require('./src/router/userRouts');

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('React Backend running.');
})
app.use('/api',UserRouter);

app.listen(3300,()=>console.log('app running on port 3300'))