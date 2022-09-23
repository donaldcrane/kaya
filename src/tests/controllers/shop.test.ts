import chai from "chai";
import chaiHttp from "chai-http";
import { user4, vendor } from "./user-sign-in-test-data";
import { shop, shop2, shop3 } from "./shop-data";
import server from "../../app";
import { IShop } from "../../utils/interface";

chai.should();

const { expect } = chai;
chai.use(chaiHttp);

describe("Add shop", () => {
  let userToken: string;
  before((done) => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("Accept", "application/json")
      .send(vendor)
      .end((err, res) => {
        if (err) throw err;
        userToken = res.body.data.token;
        done();
      });
  });
  it("should allow Vendor with token add shop", (done) => {
    chai
      .request(server)
      .post("/api/v1/shops")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(shop)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should not allow admin add shop with incomplete details", (done) => {
    chai
      .request(server)
      .post("/api/v1/shops")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json")
      .send(shop2)
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should not allow user without token add shop", (done) => {
    chai
      .request(server)
      .post("/api/v1/shops")
      .send(shop3)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.equal("Authorization not found");
        done();
      });
  });
});

describe("GET shop api route", () => {
  let userToken: string;
  let vendorToken: string;
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
  it("returns all shops", (done) => {
    chai
      .request(server)
      .get("/api/v1/shops")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved all shops.");

        data.forEach((shops: IShop[]) => {
          expect(shops).to.have.property("_id");
          expect(shops).to.have.property("name");
          expect(shops).to.have.property("address");
          expect(shops).to.have.property("vendor");
          expect(shops).to.have.property("active");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns all vendor shops", (done) => {
    chai
      .request(server)
      .get("/api/v1/shops/vendor")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved all shops.");

        data.forEach((shops: IShop[]) => {
          expect(shops).to.have.property("_id");
          expect(shops).to.have.property("name");
          expect(shops).to.have.property("address");
          expect(shops).to.have.property("vendor");
          expect(shops).to.have.property("active");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns all shops logs", (done) => {
    chai
      .request(server)
      .get("/api/v1/shops/632cd0099917aad3545722b1/logs")
      .set("Authorization", `Bearer ${vendorToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved shop logs.");

        data.forEach((shops: IShop[]) => {
          expect(shops).to.have.property("_id");
          expect(shops).to.have.property("message");
          expect(shops).to.have.property("appiontment");
          expect(shops).to.have.property("vendor");
          expect(shops).to.have.property("shop");
          expect(shops).to.have.property("customer");
          expect(shops).to.have.property("vendor");
        });

        expect(data).to.be.an("array");
        done();
      });
  });

  it("returns shop with specific id", (done) => {
    chai
      .request(server)
      .get("/api/v1/shops/632cd0099917aad3545722b1")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        const { body } = res;
        const { data } = body;
        expect(body.statusCode).to.equal(200);
        expect(body.message).to.equal("Successfully retrieved shop.");
        expect(data).to.have.property("_id");
        expect(data).to.have.property("name");
        expect(data).to.have.property("address");
        expect(data).to.have.property("vendor");
        expect(data).to.have.property("active");

        expect(data).to.be.an("object");
        done();
      });
  });
});
