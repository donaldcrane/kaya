import chai from "chai";
import chaiHttp from "chai-http";
import { user4 } from "./user-sign-in-test-data";
import { message, message2, message3 } from "./message-data";
import server from "../../app";
import { IMessage } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Add message", () => {
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
  it("should allow User with token send message", (done) => {
    chai
      .request(server)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(message)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow User send message with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/messages")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(message2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token send message", (done) => {
    chai
      .request(server)
      .post("/api/v1/messages")
      .send(message3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("GET message api route", () => {
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
  it("returns all channel messages", (done) => {
    chai
      .request(server)
      .get("/api/v1/messages/channels/632cdf57fba20a58a7e79131")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Messages retrieved successfully.");

        data.forEach((messages: IMessage[]) => {
          expect(messages).to.have.property("_id");
          expect(messages).to.have.property("message");
          expect(messages).to.have.property("channel");
          expect(messages).to.have.property("user");
        });

        expect(data).to.be.an("array");
        done();
      });
  });
});
