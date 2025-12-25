import {Container} from 'inversify'
import { TYPES } from './types'
import { ChatController } from './controller/ChatController'
import { StartCoversation } from './services/StartConversation'
import { ChatRepository } from './infrastructure/repository/ChatRepository'
import { ConversationRepository } from './infrastructure/repository/ConversationRepository'
import { GetConversations } from './services/GetConversations'
import { SendMessage } from './services/SendMessage'
import { GetChats } from './services/GetChats'
import { ReadMessages } from './services/ReadMessages'
import { GetReportedMessage } from './services/GetReportedMessage'
import { ScheduleCall } from './services/ScheduleCall'

const container=new Container()

container.bind(TYPES.IChatRepository).to(ChatRepository).inSingletonScope()
container.bind(TYPES.IConversationRepository).to(ConversationRepository).inSingletonScope()

container.bind(TYPES.IStartConversation).to(StartCoversation).inSingletonScope()
container.bind(TYPES.IGetConversations).to(GetConversations).inSingletonScope()
container.bind(TYPES.ISendMessage).to(SendMessage).inSingletonScope()
container.bind(TYPES.IGetChats).to(GetChats).inSingletonScope()
container.bind(TYPES.IReadMessages).to(ReadMessages).inSingletonScope()
container.bind(TYPES.IGetReportedMessage).to(GetReportedMessage).inSingletonScope()
container.bind(TYPES.IScheduleCall).to(ScheduleCall).inSingletonScope()

container.bind(TYPES.ChatController).to(ChatController).inSingletonScope()

export default container