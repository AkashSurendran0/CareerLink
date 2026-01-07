import { injectable } from "inversify";
import { ISubscriptionRepository } from "../../domain/respository/ISubscriptionRepository";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { getNthDay } from "../../utils/GetValidityDate";
import { Subscription } from "../../domain/entity/Subscription";
import { sequelize } from "../database/Sequelize";
import { Op, QueryTypes } from "sequelize";


@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {

    async addSubscription(id: string, user: string, validity:number): Promise<{ success: boolean; }> {
        const existingSubscription=await SubscriptionModel.findOne({where:{user:user}, raw:true});
        if(existingSubscription){
            await SubscriptionModel.destroy({where:{user:user}});
        }
        const date=getNthDay(validity);
        await SubscriptionModel.create({
            user,
            subscriptionType:id,
            validTill:date
        });
        return {success:true};
    }

    async getByUser(user: string): Promise<Subscription | null> {
        const plan=await SubscriptionModel.findOne({where:{user:user}, raw:true});
        if(!plan) return null;
        return new Subscription (
            plan?.id,
            plan?.user,
            plan?.subscriptionType,
            plan?.validTill,
            plan?.createdAt
        );
    }

    async deletePlan(user: string): Promise<{ success: boolean; }> {
        await SubscriptionModel.destroy({where:{user:user}});
        return {success:true};
    }

    async getInfo(user: string): Promise<{ success: boolean; }> {
        const plan=await SubscriptionModel.findOne({where:{user:user}, raw:true});
        if(!plan) return {success:false};
        if(new Date(plan.validTill) < new Date()) return {success:false};
        return {success:true};
    }

    async getActivePlanUsers(plan: string): Promise<{ success: boolean; }> {
        const existingPlans=await SubscriptionModel.findAll({where:{subscriptionType:plan}, raw:true});
        if(!existingPlans || existingPlans.length == 0) return {success:true};
        const now=new Date();
        for(let plan of existingPlans){
            if(plan.validTill > now){
                return {success:false};
            }
        }

        return {success:true};
    }

    async deletePlans(id: string): Promise<{ success: boolean; }> {
        await SubscriptionModel.destroy({where:{subscriptionType:id}});
        return {success:true};
    }

    async getSubscriptionAnalysis(): Promise<Array<{ month: string; count: number }>> {
        const result = await sequelize.query(
            `
            WITH months AS (
                SELECT generate_series(
                DATE_TRUNC('year', CURRENT_DATE),
                DATE_TRUNC('month', CURRENT_DATE),
                INTERVAL '1 month'
                ) AS month
            )
            SELECT
                TO_CHAR(m.month, 'Mon') AS month,
                COUNT(u.id) AS count
            FROM months m
            LEFT JOIN subscriptions u
                ON DATE_TRUNC('month', u."createdAt") = m.month
            GROUP BY m.month
            ORDER BY m.month;
            `,
            {
                type: QueryTypes.SELECT,
            }
        );
        return result as Array<{ month: string; count: number }>;
    }

    async groupByPlan(): Promise<Array<{ subscriptionType: string; count: number }>> {
        const result = await sequelize.query(
            `
            SELECT "subscriptionType", COUNT(*) AS count
            FROM subscriptions
            GROUP BY "subscriptionType"
            `,
            { type: QueryTypes.SELECT }
        );
        return result as Array<{ subscriptionType: string; count: number }>;
    }

    async getPremiumUserCount(): Promise<number> {
        const result = await SubscriptionModel.findAll({
            where: {
                validTill: {
                    [Op.gt]: new Date()
                }
            }
        });
        return result.length;
    }

}