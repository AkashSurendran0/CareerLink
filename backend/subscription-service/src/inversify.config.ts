import { Container } from "inversify";
import { TYPES } from "./types";
import { SubscriptionController } from "./interface/controllers/SubscriptionController";
import { AddSubscription } from "./application/user-cases/AddSubscription";
import { SubscriptionTypesRepository } from "./infrastructure/repository/SubscriptionTypesRepository";
import { GetAllPlans } from "./application/user-cases/GetAllPlans";
import { AlterPlanStatus } from "./application/user-cases/AlterPlanStatus";

const container=new Container()

container.bind(TYPES.ISubscriptionTypesRepository).to(SubscriptionTypesRepository).inSingletonScope()

container.bind(TYPES.IAddSubscription).to(AddSubscription).inSingletonScope()
container.bind(TYPES.IGetAllPlans).to(GetAllPlans).inSingletonScope()
container.bind(TYPES.IAlterPlanStatus).to(AlterPlanStatus).inSingletonScope()

container.bind(TYPES.SubscriptionController).to(SubscriptionController).inSingletonScope()

export default container