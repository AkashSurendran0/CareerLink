import {Client} from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

export const elasticClient=new Client({
    node:`${process.env.ELASTIC_ENDPOINT}`,
    auth:{
        apiKey:process.env.ELASTIC_KEY as string
    },
    tls:{
        rejectUnauthorized:false
    }
});