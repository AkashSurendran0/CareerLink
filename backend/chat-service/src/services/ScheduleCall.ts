import { inject, injectable } from "inversify";
import { IScheduleCall } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { ChatDto } from "../dto/ChatDto";
import { ChatMapper } from "../mapper/ChatMapper";

@injectable()
export class ScheduleCall implements IScheduleCall {

    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async scheduleCall(data: { convoId: string; date: Date; time: string; }, companyId: string): Promise<ChatDto> {
        const result = await this._chatRepository.scheduleCall(data, companyId);
        return ChatMapper.toDTO(result);
    }

}