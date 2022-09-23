import chai from "chai";
import chaiHttp from "chai-http";
import { user4, vendor } from "./user-sign-in-test-data";
import { channel, channel2, channel3 } from "./channel-data";
import server from "../../app";
import { IChannel } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Add channel", () => {
  let vendorToken: string;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(vendor)
      .end((err, res) => {
        if (err) throw err;
        vendorToken = res.body.data.token;
        done();
      });
  });
  it("should allow Vendor with token add channel", (done) => {
    chai
      .request(server)
      .post("/api/v1/channels")
      .set("Authorization", `Bearer ${vendorToken}`)
      .set("Accept", "application/json")
      .send(channel)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow Vendor add channel with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/channels")
      .set("Authorization", `Bearer ${vendorToken}`)
      .set("Accept", "application/json")
      .send(channel2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token add channel", (done) => {
    chai
      .request(server)
      .post("/api/v1/channels")
      .send(channel3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("GET channel api route", () => {
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
  it("returns all public channels", (done) => {
    chai
      .request(server)
      .get("/api/v1/channels/public")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Channels fetched successfully.");

        data.forEach((channels: IChannel[]) => {
          expect(channels).to.have.property("_id");
          expect(channels).to.have.property("name");
          expect(channels).to.have.property("type");
          expect(channels).to.have.property("members");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns all user channels", (done) => {
    chai
      .request(server)
      .get("/api/v1/channels/me")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Channels fetched successfully.");

        data.forEach((channels: IChannel[]) => {
          expect(channels).to.have.property("_id");
          expect(channels).to.have.property("name");
          expect(channels).to.have.property("type");
          expect(channels).to.have.property("members");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns channel with specific id", (done) => {
    chai
      .request(server)
      .get("/api/v1/channels/632cdf57fba20a58a7e79131")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Channel fetched successfully.");
        expect(data).to.have.property("_id");
        expect(data).to.have.property("name");
        expect(data).to.have.property("type");
        expect(data).to.have.property("members");

        expect(data).to.be.an("object");
        done();
      });
  });
});

describe("Allow user join public channel", () => {
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
  it("Allow user join public channel", (done) => {
    chai
      .request(server)
      .patch("/api/v1/channels/632cdf68fba20a58a7e79139")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully joined forum.");
        done();
      });
  });

  it("should not user join channel that does not exist", (done) => {
    chai
      .request(server)
      .patch("/api/v1/channels/632ccbbd6bb92ddb1a95686f")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
