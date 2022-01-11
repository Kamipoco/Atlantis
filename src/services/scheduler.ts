import { EventName } from '@/constants/eventname';
import { EventInstance } from '@/interfaces/event';
import { SchedulerCreationAttributes } from '@/interfaces/scheduler';
import { Sequelize } from '@/models';
import { Balance } from '@/models/balance';
import { Event } from '@/models/event';
import { Scheduler } from '@/models/scheduler';
import { User } from '@/models/user';
import cron from 'node-cron';
import { Error, Op, } from 'sequelize';
import tokens from '@/config/contracts/token';
import { logger } from '@/utils/logger';
import { schedulerSettings } from '@/config/schedulerSettings';
import axios from 'axios';
import { Hero } from '@/models/hero';
import { ItemType } from '@/constants/items';
import { Weapon } from '@/models/weapon';
import { Armor } from '@/models/armor';
import { sequelize } from "@/models";
import contract from "@/config/contracts/contracts";
import { Marketplace } from '@/models/marketplace';
import { armorsContract, herosContract, weaponsContract } from '@/utils/contract';
import { HeroInstance, GenesisHeroInstance } from '@/interfaces/hero';
import { MarketplaceInstance } from '@/interfaces/marketplace';
import { WeaponInstance } from '@/interfaces/weapon';
import { ArmorInstance } from '@/interfaces/armor';
import { GenesisHero } from '@/models/genesisHero';
export default class SchedulerService {
  failedEntries: { event: EventInstance, retry: number }[] = [];

  public initialize() {
    this.initScheduler();
  }

  public initScheduler() {
    cron.schedule(schedulerSettings.timing, async () => {
      const maxTimeStamp = (await Scheduler.findOne({ attributes: [[Sequelize.fn('MAX', Sequelize.col('timeStamp')), 'timeStamp']] }))?.getDataValue('timeStamp');

      const newScheduler: SchedulerCreationAttributes = {
        lastEventTimeStamp: 0,
        timeStamp: Date.now()
      };

      let eventsToProcess: EventInstance[] = [];

      if (maxTimeStamp) {
        const lastScheduler = await Scheduler.findOne({ where: { timeStamp: maxTimeStamp } });

        eventsToProcess = await Event.findAll({
          where: {
            param: {
              timestamp: {
                [Op.gt]: lastScheduler?.lastEventTimeStamp
              }
            }
          },
          order: [
            ['param.timestamp', 'ASC']
          ]
        });
      } else {
        eventsToProcess = await Event.findAll({
          order: [
            ['param.timestamp', 'ASC']
          ]
        });
      }

      if (this.failedEntries.length) {
        const retryEventsToProcess: EventInstance[] = [];
        for (let i = this.failedEntries.length - 1; i >= 0; i--) {
          if (this.failedEntries[i].retry > 3) {
            this.failedEntries.splice(i, 1);
            logger.error(`Failed to process event ${JSON.stringify(this.failedEntries[i].event)} 3 times. Skipped`);
          } else {
            retryEventsToProcess.push(this.failedEntries[i].event);
          }
        }

        eventsToProcess = retryEventsToProcess.concat(eventsToProcess);
      }

      for (let i = 0; i < eventsToProcess.length; i++) {
        try {
          await this.processEvent(eventsToProcess[i]);
        } catch (error) {
          logger.error(`Event ${JSON.stringify(eventsToProcess[i])} processing failed.`);

          const idx = this.failedEntries.findIndex(e => e.event.id === eventsToProcess[i].id);
          if (idx !== -1) {
            this.failedEntries[idx].retry++;
          } else {
            this.failedEntries.push({
              event: eventsToProcess[i],
              retry: 0
            });
          }
        }

        if (i === eventsToProcess.length - 1) {
          newScheduler.lastEventTimeStamp = (eventsToProcess[i].param as any).timestamp;
          await Scheduler.create(newScheduler);
        }
      }
    });
  }

  private async processEvent(event: EventInstance) {
    const eventParams = event.param as any;

    switch (event.name) {
      case EventName.DepositToken:
      case EventName.WithdrawToken: {
        const walletAddress = eventParams.from;
        const token = eventParams.token;
        const amount = eventParams.amount;

        const user = await User.findOne({ where: { walletAddress } });

        if (user) {
          const balance = await Balance.findOne({ where: { userId: user.id } });

          if (token === tokens.olyc.address) {
            await balance?.update({
              olyc: event.name === EventName.DepositToken ? balance.olyc.sub(amount) : balance.olyc.add(amount)
            });

            await balance?.save();
          } else if (token === tokens.olym.address) {
            await balance?.update({
              olym: event.name === EventName.DepositToken ? balance.olym.sub(amount) : balance.olym.add(amount)
            });

            await balance?.save();
          }
        }

        break;
      }

      case EventName.DepositNFT: {
        const walletAddress = eventParams.from;
        const tokenId = eventParams.tokenId;
        const tokenURI = eventParams.tokenURI;

        const r = await axios.get(tokenURI[0]);
        const metadata = r.data;

        const nftType = metadata.nftType;

        const attributes = {} as any;
        for (const a of metadata.attributes) {
          attributes[a.trait_type] = a.value;
        }

        if (nftType === ItemType.HERO) {
          await Hero.create({
            walletAddress,
            tokenId,
            hp: attributes['hp'],
            atk: attributes['atk'],
            pdef: attributes['pdef'],
            level: attributes['level'],
            stars: attributes['stars'],
            rarity: attributes['rarity'],
            nftType,
            race: attributes['race'],
            class: attributes['class'],
            colors: attributes['colors'],
          });
        } else if (nftType === ItemType.WEAPON) {
          await Weapon.create({
            walletAddress,
            tokenId,
            atk: attributes['atk'],
            perk: attributes['perk'],
            level: attributes['level'],
            stars: attributes['stars'],
            rarity: attributes['rarity'],
            nftType,
            class: attributes['class'],
          });
        } else if (nftType === ItemType.ARMOR) {
          await Armor.create({
            walletAddress,
            tokenId,
            hp: attributes['hp'],
            perk: attributes['perk'],
            level: attributes['level'],
            stars: attributes['stars'],
            rarity: attributes['rarity'],
            nftType,
            class: attributes['class'],
          });
        }

        break;
      }
      case EventName.Offer: {
        const itemId = eventParams.itemId;
        const tokenId = eventParams.tokenId;
        const itemContract = eventParams.itemContract;
        const owner = eventParams.owner;
        const price = eventParams.price;
        const trans = await sequelize.transaction();
        try {
          const itemMarket = await Marketplace.create({ itemId: itemId, price: price }, { transaction: trans });
          if (itemContract === contract.heros.address) {
            const hero = await Hero.findOne({ where: { tokenId: tokenId } });
            if (hero) {
              await hero.update({ marketplaceId: itemMarket.getDataValue("id") }, { transaction: trans });
            } else {
              const tokenURI = await herosContract.tokenURI(tokenId);
              const r = await axios.get(tokenURI);
              const metadata = r.data;
              const attributes = {} as any;
              for (const a of metadata.attributes) {
                attributes[a.trait_type] = a.value;
              }
              await Hero.create({
                walletAddress: owner,
                tokenId,
                hp: attributes['hp'],
                atk: attributes['atk'],
                pdef: attributes['pdef'],
                level: attributes['level'],
                stars: attributes['stars'],
                rarity: attributes['rarity'],
                nftType: ItemType.HERO,
                race: attributes['race'],
                class: attributes['class'],
                colors: attributes['colors'],
                marketplaceId: itemMarket.getDataValue("id")
              }, { transaction: trans });
            }

          } else if (itemContract === contract.weapons.address) {
            const weapon = await Weapon.findOne({ where: { tokenId: tokenId } });
            if (weapon) {
              await weapon.update({ marketplaceId: itemMarket.getDataValue("id") }, { transaction: trans });
            } else {
              const tokenURI = await weaponsContract.tokenURI(tokenId);
              const r = await axios.get(tokenURI);
              const metadata = r.data;
              const attributes = {} as any;
              for (const a of metadata.attributes) {
                attributes[a.trait_type] = a.value;
              }
              await Weapon.create({
                walletAddress: owner,
                tokenId,
                atk: attributes['atk'],
                perk: attributes['perk'],
                level: attributes['level'],
                stars: attributes['stars'],
                rarity: attributes['rarity'],
                nftType: ItemType.WEAPON,
                class: attributes['class'],
              }, { transaction: trans });
            }
          } else if (itemContract === contract.armors.address) {
            const armor = await Armor.findOne({ where: { tokenId: tokenId } });
            if (armor) {
              await armor.update({ marketplaceId: itemMarket.getDataValue("id") }, { transaction: trans });
            } else {
              const tokenURI = await armorsContract.tokenURI(tokenId);
              const r = await axios.get(tokenURI);
              const metadata = r.data;
              const attributes = {} as any;
              for (const a of metadata.attributes) {
                attributes[a.trait_type] = a.value;
              }
              await Armor.create({
                walletAddress: owner,
                tokenId,
                hp: attributes['hp'],
                perk: attributes['perk'],
                level: attributes['level'],
                stars: attributes['stars'],
                rarity: attributes['rarity'],
                nftType: ItemType.ARMOR,
                class: attributes['class'],
              });
            }
          }
          await trans.commit();
        } catch (error) {
          await trans.rollback();
          logger.debug("Offer Event: ", error);
        }
        break;
      }
      case EventName.Buy: {
        const itemId = eventParams.itemId;
        const tokenId = eventParams.tokenId;
        const itemContract = eventParams.itemContract as string;
        const buyer = eventParams.buyer;
        const trans = await sequelize.transaction();

        try {
          const itemMarket = await Marketplace.findOne({ where: { itemId: itemId } }) as MarketplaceInstance;
          if (!itemMarket) {
            throw new Error("Item not found");
          }
          if (itemContract === contract.heros.address) {
            const hero = await Hero.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as HeroInstance;
            await hero.update({
              walletAddress: buyer,
              marketplaceId: null
            }, { transaction: trans });
          } else if (itemContract === contract.weapons.address) {
            const weapon = await Weapon.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as WeaponInstance;
            await weapon.update({
              walletAddress: buyer,
              marketplaceId: null
            }, { transaction: trans });

          } else if (itemContract === contract.armors.address) {
            const armor = await Armor.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as ArmorInstance;
            await armor.update({
              walletAddress: buyer,
              marketplaceId: null
            }, { transaction: trans });

          }
          await Marketplace.destroy({
            where: { id: itemMarket.getDataValue("id") },
            transaction: trans
          });
          await trans.commit();

        } catch (error) {
          await trans.rollback();
          logger.debug("Buy Event: ", error);
        }
        break;
      }
      case EventName.Withdraw: {
        const itemId = eventParams.itemId;
        const tokenId = eventParams.tokenId;
        const itemContract = eventParams.itemContract;
        const trans = await sequelize.transaction();

        try {
          const itemMarket = await Marketplace.findOne({ where: { itemId: itemId } }) as MarketplaceInstance;

          if (!itemMarket) {
            throw new Error("Item not found");
          }

          if (itemContract === contract.heros.address) {
            const hero = await Hero.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as HeroInstance;
            await hero.update({
              marketplaceId: null
            }, { transaction: trans });
          } else if (itemContract === contract.weapons.address) {
            const weapon = await Weapon.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as WeaponInstance;
            await weapon.update({
              marketplaceId: null
            }, { transaction: trans });
          } else if (itemContract === contract.armors.address) {
            const armor = await Armor.findOne({ where: { tokenId, marketplaceId: { [Op.not]: null } }, include: { model: Marketplace } }) as ArmorInstance;
            await armor.update({
              marketplaceId: null
            }, { transaction: trans });
          }

          await Marketplace.destroy({
            where: { id: itemMarket.getDataValue("id") },
            transaction: trans
          });

          await trans.commit();
        } catch (error) {
          await trans.rollback();
          logger.debug("Withdraw Event: ", error);
        }
        break;
      }
      case EventName.Redeem: {
        const nonce = eventParams.nonce;
        const foundHero = await GenesisHero.findOne({ where: { nonce } }) as GenesisHeroInstance;
        try {
          if (!foundHero) {
            throw new Error("Hero not found");
          }
          await foundHero.update({
            redeemed: true
          })
          const heroStatus = await foundHero.save();
          if (!heroStatus) {
            throw new Error(`Hero: ${foundHero.getDataValue("id")} update faild`);
          }
        } catch (error) {
          logger.debug("Redeem Event: ", error);
        }
        break;
      }

      default:
        break;
    }
  }
}
