import { HeroMetaDataDto } from "@/dtos/metadata";
import { GenesisHeroInstance } from "@/interfaces/hero";
import { GenesisHero } from "@/models/genesisHero";
import { expect, request } from "chai"
import server from './utils/server'
describe('Genesis hero', () => {
  let hero: GenesisHeroInstance;

  before(async () => {
    // create a genesisHero for testing
    hero = await GenesisHero.create({
      hp: 1,
      atk: 1,
      pdef: 1,
      level: 1,
      stars: 1,
      rarity: 'R',
      race: 'Xebel',
      class: 'Mage',
      colors: {
        arm: 1,
        body: 2,
        helmet: 5,
        belt: 4
      },
      image: 'https://ipfs.io/ipfs/QmXp2xanM9uHsqWuj8JyCSGDaZuKzurqKVSNnMwFzPHowF',
      metaURL: 'https://gateway.pinata.cloud/ipfs/QmSqPdvM7kWR9Xtn9FprpLxFbjS8G9qSCKDbqSuEDMCe69'
    });
  });

  after(async () => {
    await hero.destroy();
  });

  it("Create a hero", async () => {
    const heroMetadata: HeroMetaDataDto = {
      name: "Zeus",
      description: "Zeus is the god of the sky in ancient Greek mythology",
      image: "QmXp2xanM9uHsqWuj8JyCSGDaZuKzurqKVSNnMwFzPHowA",
      nftType: "HERO",
      colors: {
        trait_type: "colors",
        value: {
          arm: 1,
          body: 2,
          helmet: 5,
          belt: 4
        }
      },
      race: {
        trait_type: "race",
        value: "Atlantis"
      },
      class: {
        trait_type: "class",
        value: "Warrior"
      }
    }
    const res = await request(server).post('/genHero/').send(heroMetadata);
    expect(res.status).to.equal(200);
  }).timeout(10000);

  it('it should get a list of genesisHeroes', async () => {
    const res = await request(server).get('/genHero/?page=1&limit=5');
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThanOrEqual(1);
    expect(res.body.metadata.page).to.equal(1);
    expect(res.body.metadata.limit).to.equal(5);
    expect(res.body.metadata.total).to.be.greaterThanOrEqual(1);
  })
});
