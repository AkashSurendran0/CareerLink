import {Container} from 'inversify'
import { TYPES } from './types'
import { ChatController } from './controller/ChatController'
import { StartCoversation } from './services/StartConversation'
import { ChatRepository } from './infrastructure/repository/ChatRepository'
import { ConversationRepository } from './infrastructure/repository/ConversationRepository'

const container=new Container()

container.bind(TYPES.IChatRepository).to(ChatRepository).inSingletonScope()
container.bind(TYPES.IConversationRepository).to(ConversationRepository).inSingletonScope()

container.bind(TYPES.IStartConversation).to(StartCoversation).inSingletonScope()

container.bind(TYPES.ChatController).to(ChatController).inSingletonScope()

export default container