import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Service } from "../../../server/service";
import config from "../../../server/config.js";

import TestUtil from "../_util/testUtil";
import { Controller } from "../../../server/controller";

describe("#Controller - test suite fro Controller class ", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should called getFileStream function ", async () => {
    const filename = "home/index.html";
    const fileType = ".html";
    const mockStream = TestUtil.generateReadableStream();

    const controller = new Controller();

    jest.spyOn(Service.prototype, "getFileStream").mockReturnValue({
      type: fileType,
      stream: mockStream,
    });

    const result = await controller.getFileStream(filename);

    expect(Service.prototype.getFileStream).toBeCalledWith(filename);
    expect(result).toEqual({
      type: fileType,
      stream: mockStream,
    });
  });
});
