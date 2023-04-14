import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { getAllUsersResponseMock, updateBankDetailsData, updateBankDetailsResponseData, updateProfileResponseData, updateUserData, userRequestMock } from "./user.mock";
import { ConflictException } from "@nestjs/common";

describe("UserController", () => {
  let controller: UserController;
  let userRepository;
  const mockUserRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    userRepository = module.get(getRepositoryToken(User));
    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Update a user", () => {
    it("should update a user successfully", async () => {
      expect(await controller.updateUser(updateUserData, userRequestMock)).toStrictEqual(updateProfileResponseData);
    });

    it("should return error if user is changing to a username already in use", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(true));

      await expect(controller.updateUser(updateUserData, userRequestMock)).rejects.toThrowError(ConflictException);
    });
  });

  describe("Update bank details of a user", () => {
    it("should update the bank details successfully", async () => {
      expect(await controller.updateBankDetails(updateBankDetailsData, userRequestMock)).toStrictEqual(updateBankDetailsResponseData);
    });
  });

  describe("Fetch User", () => {
    it("should fetch all users successfully", async () => {
      userRepository.findAndCount.mockImplementationOnce(() => Promise.resolve([getAllUsersResponseMock.data.users, 1]));
      expect(await controller.fetchAllUsers()).toStrictEqual(getAllUsersResponseMock);
    });
  });
});
