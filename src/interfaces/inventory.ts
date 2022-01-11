import { ItemClass, ItemHeroRace, ItemRarity } from "@/constants/items";

export interface GameInventoryQueryOptions {
  where: {
    class?: string,
    rarity?: ItemRarity,
    walletAddress: string
  },
  limit: number,
  offset: number,
  order?: any[]
}

export interface WebInventoryQueryOptions {
  limit: number,
  offset: number,
  where?: {
    class?: ItemClass,
    race?: ItemHeroRace,
    rarity?: ItemRarity,
    level?: number,
    stars?: number,
    walletAddress?: string
  }
}
