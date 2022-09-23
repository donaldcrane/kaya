import chai from "chai";
import chaiHttp from "chai-http";
import { user4, vendor } from "./user-sign-in-test-data";
import { appiontment, appiontment2, appiontment3 } from "./appiontment-data";
import server from "../../app";
import { IAppiontment } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Book appiontment", () => {
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
  it("should allow Customer with token add appiontment", (done) => {
    chai
      .request(server)
      .post("/api/v1/appiontments")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(appiontment)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow Customer add appiontment with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/appiontments")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(appiontment2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token add appiontment", (done) => {
    chai
      .request(server)
      .post("/api/v1/appiontments")
      .send(appiontment3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("GET appiontment api route", () => {
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
  it("returns all customer appiontments", (done) => {
    chai
      .request(server)
      .get("/api/v1/appiontments/customer/632ccbbd6bb92ddb1a95686e")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved customer Appiontment.");

        data.forEach((appiontments: IAppiontment[]) => {
          expect(appiontments).to.have.property("_id");
          expect(appiontments).to.have.property("customer");
          expect(appiontments).to.have.property("shop");
          expect(appiontments).to.have.property("vendor");
          expect(appiontments).to.have.property("day");
          expect(appiontments).to.have.property("time");
          expect(appiontments).to.have.property("status");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns all appiontments history", (done) => {
    chai
      .request(server)
      .get("/api/v1/appiontments/history")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved appiontment history.");

        data.forEach((appiontments: IAppiontment[]) => {
          expect(appiontments).to.have.property("_id");
          expect(appiontments).to.have.property("customer");
          expect(appiontments).to.have.property("shop");
          expect(appiontments).to.have.property("vendor");
          expect(appiontments).to.have.property("day");
          expect(appiontments).to.have.property("time");
          expect(appiontments).to.have.property("status");
        });

        expect(data).to.be.an("array");
        done();
      });
  });
});

describe("update appiontment status api route", () => {
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
  it("Allow Vendor update appiontment status", (done) => {
    chai
      .request(server)
      .patch("/api/v1/appiontments/632cd4ff3a9a29233ff5d134?status=accepted")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        const { body } = res;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully updated Appiontment.");
        done();
      });
  });

  it("should not update appiontment that does not exist", (done) => {
    chai
      .request(server)
      .patch("/api/v1/appiontments/632ccbbd6bb92ddb1b95686f?status=accepted")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
