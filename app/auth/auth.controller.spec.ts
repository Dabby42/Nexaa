import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { loginUserSuccessMockData, userRepositoryMock } from "./auth.mock";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "app/user/entities/user.entity";
import { UserService } from "app/user/user.service";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthController", () => {
  let controller: AuthController;
  let module: TestingModule;
  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => Promise.resolve(userRepositoryMock)),
  };

  const mockJWTService = {
    sign: jest.fn().mockImplementation(() => loginUserSuccessMockData.data.token),
  };

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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("login a user", () => {
    it("it should return the user token when login is successful", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "olamide";

      expect(await controller.loginUser({ email, password })).toStrictEqual(loginUserSuccessMockData);
    });

    it("it should return an error when no user is found", async () => {
      const mockRepository = {
        findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
      };

      module = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          AuthService,
          {
            provide: getRepositoryToken(User),
            useValue: mockRepository,
          },
          {
            provide: JwtService,
            useValue: mockJWTService,
          },
          {
            provide: UserService,
            useValue: jest.fn(),
          },
        ],
      }).compile();

      controller = module.get<AuthController>(AuthController);

      const email = "olamide.aboyyeji@konga.com";
      const password = "olamide";

      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });

    it("it should return an error when password does not match", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "olatttde";

      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });
  });
});
