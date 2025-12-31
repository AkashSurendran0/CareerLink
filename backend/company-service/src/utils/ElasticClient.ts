import {Client} from "@elastic/elasticsearch";
import dotenv from 'dotenv'

dotenv.config()

export const elasticClient=new Client({
    node:`${process.env.ELASTIC_CLIENT_ROUTE}`,
    auth:{
        username:"elastic",
        password:"akash1"
    },
    tls:{
        rejectUnauthorized:false
    }
});