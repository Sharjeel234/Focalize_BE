import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoute from './routes/user';
import taskRoute from './routes/task';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", authRoute);
app.use("/task", taskRoute);

app.get('/', (req, res) => {
    res.send("Project is Successfully Running");
});

const CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;

const PORT = process.env.PORT || 5000;

mongoose.connect(
    CONNECTION_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(
        () => app.listen(
            PORT, () => console.log(`Server is Running ON Port: ${PORT}`)
        )
    ).catch(
        (error) => console.log(error)
    );
