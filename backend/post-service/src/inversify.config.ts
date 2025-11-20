import { PostController } from "./controller/PostController";
import { Container } from "inversify";
import { TYPES } from "./types";
import { PostContent } from "./services/PostContent";
import { PostRepository } from "./infrastructure/repository/PostRepository";

const container=new Container()

container.bind(TYPES.IPostRepository).to(PostRepository).inSingletonScope()

container.bind(TYPES.IPostContent).to(PostContent).inSingletonScope()

container.bind(TYPES.PostController).to(PostController).inSingletonScope()

export default container