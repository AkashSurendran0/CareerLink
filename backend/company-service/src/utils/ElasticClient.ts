import {Client} from "@elastic/elasticsearch";
import dotenv from 'dotenv'

dotenv.config()

export const elasticClient=new Client({
    node:"http://localhost:9200",
    auth:{
        username:"elastic",
        password:"akash1"
    },
    tls:{
        rejectUnauthorized:false
    }
});