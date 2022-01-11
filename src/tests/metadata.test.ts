import { HeroMetaDataDto } from "@/dtos/metadata";
import chaiHttp from "chai-http";
import * as chai from 'chai';
import { request } from 'chai';
import server from "./utils/server";
import { HeroMetadataBody } from "@/interfaces/metadata";
chai.use(chaiHttp);

describe("Hero metadata url", () => {

  it("Test hero metadata with signature", async () => {
    //Login
    const dataLoginUser = {
      username: "phatngt",
      password: "phat12345"
    }
    let res = await request(server).post("/user/login").send(dataLoginUser);
    const token = res.body.data;
    const heroMetadata: HeroMetaDataDto = {
      name: "Zeus",
      description: "Zeus is the god of the sky in ancient Greek mythology",
      image: "QmXp2xanM9uHsqWuj8JyCSGDaZuKzurqKVSNnMwFzPHowA",
      nftType: "HERO",
      colors: {
        trait_type: "colors",
        value: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]
      },
      race: {
        trait_type: "race",
        value: "Atlantis"
      },
      class: {
        trait_type: "class",
        value: "Warrior"
      },
    }
    const infoTrans = {
      from: "0x1924dBdf613db22712345e4D3e6D712b30cA199d",
      tokenId: 1,
      nonce: 1,
    }

    const mockData: HeroMetadataBody = {
      metadata: heroMetadata,
      infoTrans: infoTrans,
    }

    res = await request(server).post("/meta/heroMetadataURL").set({ 'Authorization': `Bearer ${token}` }).send(mockData);
    const data = res.body.data;
  }).timeout(10000);
});
