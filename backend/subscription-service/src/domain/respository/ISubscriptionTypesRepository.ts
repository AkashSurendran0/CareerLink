import { SubscriptionType } from "../entity/SubscriptionType";
import { SubscriptionData } from "../use-cases/ISubscriptionTypesUseCases";

export interface ISubscriptionTypesRepository {
  addSubscription(data: SubscriptionData): Promise<{ success: boolean }>
  getAllPlans(): Promise<SubscriptionType[]>
  alterPlanStatus(id: string): Promise<{ success: boolean }>
  getActivePlans(): Promise<SubscriptionType[]>
  findById(id: string): Promise<SubscriptionType>
  deleteType(id: string): Promise<{ success: true }>
  editPlan(data: SubscriptionData): Promise<{ success: boolean }>
}