import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { changeUserPasswordSuccessMock, loginUserSuccessMockData, registerUserSuccessMock, userDataMock, userRepositoryMock } from "./auth.mock";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "app/user/entities/user.entity";
import { UserService } from "app/user/user.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER, ConflictException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { GoogleAuthService } from "./google-auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let module: TestingModule;
  let userRepository;
  let googleAuthService;
  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => Promise.resolve(userRepositoryMock)),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn(),
    insert: jest.fn().mockImplementation((userData) =>
      Promise.resolve({
        id: 1,
        ...userData,
      })
    ),
  };

  const mockJWTService = {
    sign: jest.fn().mockImplementation(() => loginUserSuccessMockData.data.token),
  };

  const mockGoogleAuthService = {
    authenticate: jest.fn().mockImplementation(() => userRepositoryMock.email),
  };

  const mockCache: Cache = {
    get: jest.fn().mockImplementation(() => userRepositoryMock.id),
    set: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJWTService,
        },
        {
          provide: GoogleAuthService,
          useValue: mockGoogleAuthService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userRepository = module.get(getRepositoryToken(User));
    googleAuthService = module.get<GoogleAuthService>(GoogleAuthService);
  });

  describe("sign up a new user", function () {
    it("should return a success response", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));

      expect(await controller.createUser(userDataMock)).toEqual(registerUserSuccessMock);
    });

    it("should return a conflict if user already exists", async () => {
      await expect(controller.createUser(userDataMock)).rejects.toThrowError(ConflictException);
    });

    it("should return an error if insert method throws", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      userRepository.insert.mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(controller.createUser(userDataMock)).rejects.toThrowError(UnprocessableEntityException);
    });
  });

  describe("login a user", () => {
    it("should return the user token when login is successful", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "password123";
      expect(await controller.loginUser({ email, password })).toStrictEqual(loginUserSuccessMockData);
    });

    it("should return an error when no user is found", async () => {
      const email = "olamide.aboyyeji@konga.com";
      const password = "olamide";
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(null));
      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });

    it("should return an error when password does not match", async () => {
      const email = "olamide.aboyeji@konga.com";
      const password = "wrong_password";

      await expect(controller.loginUser({ email, password })).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe("login a user with google", () => {
    it("should return the user token when google login is successful", async () => {
      expect(await controller.loginUserWithGoogle({ token: "valid_token" })).toStrictEqual(loginUserSuccessMockData);
    });

    it("should return an unauthorized error if google token is invalid", async () => {
      googleAuthService.authenticate.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });
      await expect(controller.loginUserWithGoogle({ token: "invalid_token" })).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe("change user password", () => {
    it("should return a success response", async () => {
      const oldPassword = "password123";
      const newPassword = "password";
      const req = {
        user: userRepositoryMock,
      };

      expect(await controller.changePassword(req, { oldPassword, newPassword })).toStrictEqual(changeUserPasswordSuccessMock);
    });
  });
});
