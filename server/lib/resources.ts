import { resourceTypeEnum } from "../db/schema/resource"

type ResourceDefinition = {
  name: string
  type: (typeof resourceTypeEnum.enumValues)[number]
  maxAmount?: number
}
export const defaultResources: Record<
  "Genshin Impact" | "Honkai Star Rail" | "Zenless Zone Zero",
  Array<ResourceDefinition>
> = {
  "Genshin Impact": [
    { name: "Primogems", type: "Currency" },
    { name: "Mora", type: "Currency" },
    { name: "Masterless Stardust", type: "Currency" },
    { name: "Masterless Starglitter", type: "Currency" },
    { name: "Acquaint Fate", type: "Currency" },
    { name: "Intertwined Fate", type: "Currency" },
    { name: "Resin", type: "Stamina", maxAmount: 200 },
    { name: "Fragile Resin", type: "Stamina" },
    { name: "Transient Resin", type: "Stamina" },
    { name: "Condensed Resin", type: "Stamina", maxAmount: 5 },
  ],
  "Honkai Star Rail": [
    { name: "Stellar Jades", type: "Currency" },
    { name: "Credits", type: "Currency" },
    { name: "Undying Embers", type: "Currency" },
    { name: "Undying Starlight", type: "Currency" },
    { name: "Star Rail Pass", type: "Currency" },
    { name: "Star Rail Special Pass", type: "Currency" },
    { name: "Trailblaze Power", type: "Stamina", maxAmount: 240 },
    { name: "Reserved Trailblaze Power", type: "Stamina", maxAmount: 2400 },
  ],
  "Zenless Zone Zero": [
    { name: "Monochrome", type: "Currency" },
    { name: "Polychrome", type: "Currency" },
    { name: "Denny", type: "Currency" },
    { name: "Fading Signal", type: "Currency" },
    { name: "Residual Signal", type: "Currency" },
    { name: "Master Tape", type: "Currency" },
    { name: "Encrypted Master Tape", type: "Currency" },
    { name: "Boopon", type: "Currency" },
    { name: "Battery Charge", type: "Stamina", maxAmount: 240 },
    { name: "Backup Battery Charge", type: "Stamina", maxAmount: 2400 },
  ],
}
