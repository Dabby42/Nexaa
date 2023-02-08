import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { updateProfileResponseData, updateUserData, userRequestMock } from "./user.mock";
import { BadRequestException } from "@nestjs/common";

describe("UserController", () => {
  let controller: UserController;
  let userRepository;
  const mockUserRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
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

      await expect(controller.updateUser(updateUserData, userRequestMock)).rejects.toThrowError(BadRequestException);
    });
  });
});
