import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import chatRouter from "./routes/chat.routes.js";


dotenv.config();


const app = express();


const PORT = process.env.PORT || 5001;


app.use(cors());

app.use(express.json());



app.use("/api/chat", chatRouter);



app.get("/",(req,res)=>{

    res.json({
        message:"Astrotring AI Server Running"
    })

})



app.listen(PORT,()=>{

    console.log(`Server running on ${PORT}`);

})