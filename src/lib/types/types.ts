import {
  Color,
  NpcInstance,
  NpcTemplate,
  Prisma,
  PveBattle,
  Species,
  User,
} from "@prisma/client";
import { ACTION_OPTIONS } from "../zod/PveBattle";

export interface iResponseJSON {
  success: true | false;
  message?: string;
  data?: ResponseData;
}

export type ResponseData =
  | iResponseDataError
  | UserPublic
  | iResponseDataToken
  | UserNoHash
  | UserNoHash[]
  | Color
  | Color[]
  | Species
  | Species[]
  | NpcTemplate
  | NpcTemplate[]
  | NpcInstance
  | NpcInstance[]
  | PveBattle
  | PveBattle[]
  | iPveAttackResponse;

export type UserNoHash = Omit<User, "passwordHash">;

export type UserPublic = Omit<
  User,
  "passwordHash" | "role" | "email" | "createdAt" | "updatedAt"
>;

export interface iResponseDataError {
  errors: { [key: string]: string[] | undefined };
}

export interface iResponseDataToken {
  accessToken: string;
}

export interface iValidatedUserData {
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
}

export interface NewPetData {
  health: number;
  mood: number;
  ownerId: number;
  speciesId: number;
  colorId: number;
  name: string;
}

export interface iNewBattleData {
  opponentTemplates: {
    id: number;
    name: string;
    speciesId: number;
    colorId: number;
    health: number;
    mood: number;
    battlePower: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  userId: number;
}

export type PveBattleWithOpponents = Prisma.PveBattleGetPayload<{
  include: {
    opponents: {
      include: {
        template: {
          select: {
            color: { select: { name: true } };
            species: { select: { name: true } };
          };
        };
      };
    };
  };
}>;

export type PetWithColorSpecies = Prisma.PetGetPayload<{
  include: {
    color: { select: { name: true } };
    species: { select: { name: true } };
  };
}>;

export type NpcInstanceWithColorSpecies = Prisma.NpcInstanceGetPayload<{
  include: {
    template: {
      select: {
        color: { select: { name: true } };
        species: { select: { name: true } };
      };
    };
  };
}>;

export type VirtualStats = {
  speed: number;
  speedBonus: number;
  accuracy: number;
  accuracyBonus: number;
  power: number;
  powerBonus: number;
  wit: number;
  witBonus: number;
};

export type iPveAttackResponse = unknown;

export type ActorWithStats = (
  | PetWithColorSpecies
  | NpcInstanceWithColorSpecies
) &
  VirtualStats;

export type ActorWithAction = ActorWithStats & { action: ACTION_OPTIONS };
