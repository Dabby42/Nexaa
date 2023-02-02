import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { loginUserSuccessMockData, userRepositoryMock } from "./auth.mock";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "app/user/entities/user.entity";
import { UserService } from "app/user/user.service";
import { UnauthorizedException } from "@nestjs/common";
import { GoogleAuthService } from "./google-auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let module: TestingModule;
  let userRepository;
  let googleAuthService;
  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => Promise.resolve(userRepositoryMock)),
  };

  const mockJWTService = {
    sign: jest.fn().mockImplementation(() => loginUserSuccessMockData.data.token),
  };

  const mockGoogleAuthService = {
    authenticate: jest.fn().mockImplementation(() => userRepositoryMock.email)
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJWTService,
        },
        {
          provide: UserService,
          useValue: jest.fn(),
        },
        {
          provide: GoogleAuthService,
          useValue: mockGoogleAuthService
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userRepository = module.get(getRepositoryToken(User));
    googleAuthService = module.get<GoogleAuthService>(GoogleAuthService);
  });

  describe("login a user", () => {
    it("it should return the user token when login is successful", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "olamide";
      expect(await controller.loginUser({ email, password })).toStrictEqual(loginUserSuccessMockData);
    });

    it("it should return an error when no user is found", async () => {

      const email = "olamide.aboyyeji@konga.com";
      const password = "olamide";
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });

    it("it should return an error when password does not match", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "wrong_password";

      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe("login a user with google", () => {
    it('should return the user token when google login is successful', async () => {

      expect(await controller.loginUserWithGoogle({ token : "valid_token"})).toStrictEqual(loginUserSuccessMockData);
    });

    it('should return an unauthorized error if google token is invalid', async () => {
      googleAuthService.authenticate.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      })
      await expect(controller.loginUserWithGoogle({token : "invalid_token"})).rejects.toThrowError(UnauthorizedException);
    });
  })
});
