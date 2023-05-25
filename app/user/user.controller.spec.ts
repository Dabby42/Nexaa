import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import {
  approveAffiliateResponse,
  updateBankDetailsData,
  updateBankDetailsResponseData,
  updateProfileResponseData,
  updateUserData,
  userRequestMock,
  userRepositoryMock,
  disableAffiliateResponse,
  getAllUsersResponseMock
} from "./user.mock";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { Admin } from "./entities/admin.entity";
import { LinksService } from "../links/links.service";

describe("UserController", () => {
  let controller: UserController;
  let userRepository;
  const mockUserRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([])),
  };
  const mockAdminRepository = {
    update: jest.fn(),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([])),
    findOne: jest.fn(() => null),
    save: jest.fn(() => userRepositoryMock),
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
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: LinksService,
          useValue: {},
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

  describe("Fetch Affiliates", () => {
    it("should fetch all affiliates successfully", async () => {
      userRepository.findAndCount.mockImplementationOnce(() => Promise.resolve([getAllUsersResponseMock.data.users, 1]));
      expect(await controller.fetchAllAffiliates()).toStrictEqual(getAllUsersResponseMock);
    });
  });

  describe("Approve affiliate", () => {
    it("should approve affiliate successfully.", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(userRepositoryMock));
      expect(await controller.approveAffiliate({ affiliate_id: 3 }, userRequestMock)).toStrictEqual(approveAffiliateResponse);
    });

    it("should fail is affiliate is already approved.", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve({ ...userRepositoryMock, status: 1 }));
      await expect(controller.approveAffiliate({ affiliate_id: 3 }, userRequestMock)).rejects.toThrowError(BadRequestException);
    });
  });

  describe("Disable/reject affiliate", () => {
    it("should reject affiliate successfully.", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(userRepositoryMock));
      expect(await controller.rejectAffiliate({ affiliate_id: 3, reason: "Fake email and phone number" }, userRequestMock)).toStrictEqual(disableAffiliateResponse);
    });

    it("should fail if reason was not provided.", async () => {
      userRepository.findOne.mockImplementationOnce(() => Promise.resolve(userRepositoryMock));
      await expect(controller.rejectAffiliate({ affiliate_id: 3 }, userRequestMock)).rejects.toThrowError(BadRequestException);
    });
  });
});
