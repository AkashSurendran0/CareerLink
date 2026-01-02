import { UserModel } from "../infrastructure/models/UserModel";
import { elasticClient } from "../utils/ElasticClient";

async function syncUsers () {
    const users=await UserModel.findAll({raw:true});

    const operations=users.flatMap((user)=>[
        {index:{_index:"users", _id:user.id}},
        {
            id:user.id,
            username:user.username,
            email:user.email,
            createdAt:user.createdAt,
            suspended:user.suspended            
        }
    ]);

    const response=await elasticClient.bulk({refresh:true, operations});
    
    if(response.errors){
        console.error("Sync error", response);
    }else{
        console.log(`synced ${users.length}`);
    }
}

syncUsers().catch(console.error);