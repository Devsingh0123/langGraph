import llm from "../config/llm.js";


export const chatController = async(req,res)=>{

    try{

        const {message}=req.body;


        const response = await llm.invoke(message);



        res.json({

            response:response.content

        })


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Something went wrong"
        })

    }

}