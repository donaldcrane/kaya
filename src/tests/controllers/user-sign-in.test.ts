import chai from "chai";
import fs from "fs";
import chaiHttp from "chai-http";
import server from "../../app";
import {
  user, user2, user3, user4, profile
} from "./user-sign-in-test-data";

const { expect } = chai;
chai.should();
chai.use(chaiHttp);
describe("Should test all users", async () => {
  describe("/api/v1/users/signin should sign in a user", () => {
    it("it should sign in a user with complete details successfully", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User Logged in Successfully.");
          done();
        });
    });
    it("it should not sign in a user with incomplete details", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user2)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it("it should not sign in a user without a registered email", (done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user3)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error").eql("Email does not exist.");
          done();
        });
    });
  });

  describe("should handle single user's operation", () => {
    let userToken: string;
    before((done) => {
      chai
        .request(server)
        .post("/api/v1/users/signin")
        .set("Accept", "application/json")
        .send(user4)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.data.token;
          done();
        });
    });
    it("it should not update a user's profile who is not signed in", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/profile")
        .send(profile)
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body.error).to.equal("Authorization not found");
          done();
        });
    });
    it("it should update a logged in user's profile", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .send(profile)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Profile updated Successfully.");
          done();
        });
    });
    it("it should update a logged in user's profile picture", (done) => {
      chai
        .request(server)
        .patch("/api/v1/users/picture")
        .set("Authorization", `Bearer ${userToken}`)
        .set("content-type", "form-data")
        .attach("image", fs.readFileSync(`${__dirname}/file.jpg`), "file.jpg")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Picture uploaded Successfully.");
          done();
        });
    });
  });
});
