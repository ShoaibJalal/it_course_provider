const chai = require("chai"),
  { expect } = chai,
  usersController = require("../controllers/usersController");

describe("usersController", () => {
  describe("getUserParams", () => {
    it("should convert request body to contain the name attributes of the user object", () => {
      var body = {
        first: "Shoaib",
        last: "Jalal",
        email: "shoaib@yahoo.com",
        password: 12345,
        zipCode: 10000
      };
      expect(usersController.getUserParams(body)).to.deep.include({
        name: {
          first: "Shoaib",
          last: "Jalal"
        }
      });
    });

    it("should return an empty object with empty request body input", () => {
      var emptyBody = {};
      expect(usersController.getUserParams(emptyBody)).to.deep.include({});
    });
  });
});
