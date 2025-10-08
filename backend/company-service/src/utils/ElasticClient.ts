import {Client} from "@elastic/elasticsearch";
import dotenv from 'dotenv'

dotenv.config()

export const elasticClient=new Client({
    node:"https://localhost:9200",
    auth:{
        username:"elastic",
        password:"V1Hblk3hZq4VlnecLucU"
    },
    tls:{
        rejectUnauthorized:false
    }
});