import { PostController } from "./controller/PostController";
import { Container } from "inversify";
import { TYPES } from "./types";
import { PostContent } from "./services/PostContent";
import { PostRepository } from "./infrastructure/repository/PostRepository";
import { GetAllPosts } from "./services/GetAllPosts";
import { AlterPostLike } from "./services/AlterPostLike";
import { AddComment } from "./services/AddComment";
import { GetSinglePostDetails } from "./services/GetSinglePostDetails";

const container=new Container()

container.bind(TYPES.IPostRepository).to(PostRepository).inSingletonScope()

container.bind(TYPES.IPostContent).to(PostContent).inSingletonScope()
container.bind(TYPES.IGetAllPosts).to(GetAllPosts).inSingletonScope()
container.bind(TYPES.IAlterPostLike).to(AlterPostLike).inSingletonScope()
container.bind(TYPES.IAddComment).to(AddComment).inSingletonScope()
container.bind(TYPES.IGetSinglePostDetails).to(GetSinglePostDetails).inSingletonScope()

container.bind(TYPES.PostController).to(PostController).inSingletonScope()

export default container