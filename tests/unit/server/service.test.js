import { describe, jest, expect, test } from "@jest/globals";
import fs from "fs";
import fsPromises from "fs/promises";
import path, { join } from "path";
import config from "../../../server/config";
import { Service } from "../../../server/service";

import TestUtil from "../_util/testUtil";

const {
  dir: { publicDirectory },
} = config;

const service = new Service();

describe("#Service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Should call createFileStream and return a readable file stream", async () => {
    const mockReadableStream = TestUtil.generateReadableStream();

    const filename = "file.ext";

    jest.spyOn(fs, "createReadStream").mockResolvedValue(mockReadableStream);

    const result = await service.createFileStream(filename);

    expect(fs.createReadStream).toHaveBeenCalledWith(filename);
    expect(result).toEqual(mockReadableStream);
  });

  test("Should call getFileInfo and return a object with file info", async () => {
    const file = "dir/file.ext";
    const expectedFile = join(publicDirectory, file);
    const expectedResult = {
      type: ".ext",
      name: expectedFile,
    };

    jest.spyOn(fsPromises, "access").mockResolvedValue();
    jest.spyOn(path, "join").mockResolvedValue();

    const result = await service.getFileInfo(file);

    expect(fsPromises.access).toHaveBeenCalledWith(expectedFile);
    expect(result).toEqual(expectedResult);
  });

  test("Should call getFileStream and return a object with stream and type", async () => {
    const mockReadableStream = TestUtil.generateReadableStream();
    const file = "dir/file.ext";
    const mockFileInfo = {
      type: ".ext",
      name: "dir/file.ext",
    };
    const expectedFileStream = {
      stream: Promise.resolve(),
      type: ".ext",
    };

    jest
      .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
      .mockResolvedValue(mockFileInfo);
    jest
      .spyOn(Service.prototype, Service.prototype.createFileStream.name)
      .mockResolvedValue(mockReadableStream);

    const result = await service.getFileStream(file);

    expect(result).toEqual(expectedFileStream);
  });
});
