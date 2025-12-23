import { Container } from "inversify";
import { TYPES } from "./types";
import { SubscriptionController } from "./interface/controllers/SubscriptionController";
import { AddSubscription } from "./application/user-cases/AddSubscription";
import { SubscriptionTypesRepository } from "./infrastructure/repository/SubscriptionTypesRepository";
import { GetAllPlans } from "./application/user-cases/GetAllPlans";
import { AlterPlanStatus } from "./application/user-cases/AlterPlanStatus";
import { GetActivePlans } from "./application/user-cases/GetActivePlans";
import { SubscriptionRepository } from "./infrastructure/repository/SubscriptionRepository";
import { BuySubscription } from "./application/user-cases/BuySubscription";
import { GetUserSubscription } from "./application/user-cases/GetUserSubscription";
import { DeletePlan } from "./application/user-cases/DeletePlan";
import { GetSubscriptionInfo } from "./application/user-cases/GetSubscriptionInfo";
import { GetActivePlanUsers } from "./application/user-cases/GetActivePlanUsers";
import { DeletePlanType } from "./application/user-cases/DeletePlanType";
import { GetSubscriptionAnalysis } from "./application/user-cases/GetSubscriptionAnalysis";
import { GetSubscriptionTypeAnalytics } from "./application/user-cases/GetSubscriptionTypeAnalytics";

const container=new Container()

container.bind(TYPES.ISubscriptionTypesRepository).to(SubscriptionTypesRepository).inSingletonScope()
container.bind(TYPES.ISubscriptionRepository).to(SubscriptionRepository).inSingletonScope()

container.bind(TYPES.IAddSubscription).to(AddSubscription).inSingletonScope()
container.bind(TYPES.IGetAllPlans).to(GetAllPlans).inSingletonScope()
container.bind(TYPES.IAlterPlanStatus).to(AlterPlanStatus).inSingletonScope()
container.bind(TYPES.IGetActivePlans).to(GetActivePlans).inSingletonScope()
container.bind(TYPES.IBuySubscription).to(BuySubscription).inSingletonScope()
container.bind(TYPES.IGetUserSubscription).to(GetUserSubscription).inSingletonScope()
container.bind(TYPES.IDeletePlan).to(DeletePlan).inSingletonScope()
container.bind(TYPES.IGetSubscriptionInfo).to(GetSubscriptionInfo).inSingletonScope()
container.bind(TYPES.IGetActivePlanUsers).to(GetActivePlanUsers).inSingletonScope()
container.bind(TYPES.IDeletePlanType).to(DeletePlanType).inSingletonScope()
container.bind(TYPES.IGetSubscriptionAnalysis).to(GetSubscriptionAnalysis).inSingletonScope()
container.bind(TYPES.IGetSubscriptionTypeAnalytics).to(GetSubscriptionTypeAnalytics).inSingletonScope()

container.bind(TYPES.SubscriptionController).to(SubscriptionController).inSingletonScope()

export default container