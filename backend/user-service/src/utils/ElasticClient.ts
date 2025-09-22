import {Client} from '@elastic/elasticsearch'

export const elasticClient=new Client({
    node:'https://localhost:9200',
    auth:{
        username:'elastic',
        password:'V1Hblk3hZq4VlnecLucU'
    },
    tls:{
        rejectUnauthorized:false
    }
})