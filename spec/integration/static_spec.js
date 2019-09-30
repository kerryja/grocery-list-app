const request = require("request");
const server = require("../../server");
const base = "http://localhost:3000/";

describe("routes: static", () => {
  var originalTimeout;
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  describe("GET /", () => {
    it("should return status code 200 and have Grocery App in the body", done => {
      //before tests are executed, make sure server is started. comes from modeule.exports on server
      server.then(() => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(body).toContain("Grocery App");

          done();
        });
      });
    });
  });
});
