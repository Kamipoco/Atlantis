import * as chai from 'chai';
import chaiHttp from "chai-http";
import { expect, request } from 'chai';
// import server from './utils/server'
chai.use(chaiHttp);

describe("Balance api", async () => {
  it("GET /balance", async () => {
    const dataLoginUser = {
      username: "phatngt",
      password: "phat12345"
    }
    let res = await request("http://127.0.0.1:3000").post('/user/login').send(dataLoginUser);
    const token = res.body.data;
    res = await request("http://127.0.0.1:3000").get("/user/balance").set({ "Authorization": `Bearer ${token}` });
    expect(res.status).to.equal(200);
  });
});
