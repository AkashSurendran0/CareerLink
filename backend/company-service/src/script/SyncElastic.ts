import { CompanyModel } from "../infrastructure/models/CompanyModel";
import { elasticClient } from "../utils/ElasticClient";

async function syncUsers () {
    const companies=await CompanyModel.findAll({raw:true});

    const operations=companies.flatMap((company)=>[
        {index:{_index:"companies", _id:company.id}},
        {
            id:company.id,
            logo:company.logo,
            name:company.name,
            createdAt:company.createdAt,
            suspended:company.suspended            
        }
    ]);

    const response=await elasticClient.bulk({refresh:true, operations});
    
    if(response.errors){
        console.error("Sync error", response);
    }else{
        console.log(`synced ${companies.length}`);
    }
}

syncUsers().catch(console.error);