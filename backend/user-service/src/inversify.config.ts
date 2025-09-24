import { Container } from "inversify";
import { TYPES } from "./types";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { UserDetailsRepository } from "./infrastructure/repositories/UserDetailsRepository";
import { LoginUser } from "./application/use-cases/LoginUser";
import { SignupUser } from "./application/use-cases/SignupUser";
import { AddUserDetails } from "./application/use-cases/AddUserDetails";
import { AlterUserStatus } from "./application/use-cases/AlterUserStatus";
import { ChangePass } from "./application/use-cases/ChangePass";
import { CheckUserBlock } from "./application/use-cases/CheckUserBlock";
import { EditUserDetails } from "./application/use-cases/EditUserDetails";
import { GetUserDetails } from "./application/use-cases/GetUserDetails";
import { GetAllUsers } from "./application/use-cases/GetUsers";
import { GoogleLogin } from "./application/use-cases/GoogleLogin";
import { UserController } from "./interfaces/controllers/UserController";
import { UserDetailsController } from "./interfaces/controllers/UserDetailsController";
import { SendOTP } from "./application/use-cases/SignupUser";
import { SendResetOTP } from "./application/use-cases/ChangePass";
import { Mailer } from "./utils/MailHelper";

const container = new Container();

container.bind(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind(TYPES.IUserDetailsRepository).to(UserDetailsRepository).inSingletonScope();

container.bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
container.bind<SignupUser>(TYPES.SignupUser).to(SignupUser);
container.bind<AddUserDetails>(TYPES.AddUserDetails).to(AddUserDetails);
container.bind<AlterUserStatus>(TYPES.AlterUserStatus).to(AlterUserStatus);
container.bind<ChangePass>(TYPES.ChangePass).to(ChangePass);
container.bind<CheckUserBlock>(TYPES.CheckUserBlock).to(CheckUserBlock);
container.bind<EditUserDetails>(TYPES.EditUserDetails).to(EditUserDetails);
container.bind<GetUserDetails>(TYPES.GetUserDetails).to(GetUserDetails);
container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);
container.bind<GoogleLogin>(TYPES.GoogleLogin).to(GoogleLogin);
container.bind<SendOTP>(TYPES.SendOTP).to(SendOTP);
container.bind<SendResetOTP>(TYPES.SendResetOTP).to(SendResetOTP);
container.bind<Mailer>(TYPES.Mailer).to(Mailer);

container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserDetailsController>(TYPES.UserDetailsController).to(UserDetailsController);

export default container;