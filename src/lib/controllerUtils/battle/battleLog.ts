import { ActorWithAction } from "../../types/types";
import { ACTION_OPTIONS } from "../../zod/PveBattle";

const battleLog = () => {
  let data: string[] = [];

  const actorName = (actor: ActorWithAction) => {
    const isPet = "color" in actor;
    return `${isPet ? `${actor.name}` : `the ${actor.template.species.name}`}`;
  };

  return {
    data,
    actorDied: (actor: ActorWithAction) => {
      data.push(`${actorName(actor)} collapsed lifelessly to the ground.`);
    },
    actorDead: (actor: ActorWithAction) => {
      data.push(`It looks like ${actorName(actor)} isn't breathing...`);
    },
    actorMindloss: (actor: ActorWithAction) => {
      data.push(`The light fades from ${actorName(actor)}'s eyes.`);
    },
    actorMindless: (actor: ActorWithAction) => {
      data.push(
        `It looks like ${actorName(actor)} isn't aware of its surroundings...`
      );
    },
    actorAshes: (actor: ActorWithAction) => {
      data.push(`All that remains of ${actorName(actor)} is a pile of ash...`);
    },
    actorTurn: (actor: ActorWithAction) => {
      data.push(`${actorName(actor)} prepares to act.`);
    },
    actorAttacked: (actor: ActorWithAction, target: ActorWithAction) => {
      data.push(`${actorName(actor)} brutally attacked ${actorName(target)}.`);
    },
    actorAttackHit: (
      actor: ActorWithAction,
      target: ActorWithAction,
      didCrit: boolean,
      damage: number
    ) => {
      data.push(
        `${`It ${
          didCrit ? "CRITICALLY " : ""
        }hit and did ${damage} health damage.`}`
      );
    },
    actorInsulted: (actor: ActorWithAction, target: ActorWithAction) => {
      data.push(`${actorName(actor)} viciously insulted ${actorName(target)}.`);
    },
    actorInsultHit: (
      actor: ActorWithAction,
      target: ActorWithAction,
      didCrit: boolean,
      damage: number
    ) => {
      data.push(
        `${actorName(target)} was ${
          didCrit ? "CRITICALLY " : ""
        }discouraged and took ${damage} mood damage.`
      );
    },
    actorMissed: (actor: ActorWithAction, target: ActorWithAction) => {
      data.push(
        `${
          actor.action === ACTION_OPTIONS.attack
            ? `${actorName(target)} evaded the attack.`
            : `${actorName(target)} wasn't listening.`
        } `
      );
    },
    actorDefended: (actor: ActorWithAction, recoveryAmount: number) => {
      data.push(
        `${actorName(
          actor
        )} defended itself, increasing its health and mood by ${recoveryAmount}.`
      );
    },
    actorRan: (actor: ActorWithAction) => {
      data.push(`${actorName(actor)} ran away in a panic.`);
    },
    actorRanFailed: (actor: ActorWithAction) => {
      data.push(
        `${actorName(actor)} tried to get away but its escape was blocked.`
      );
    },
    battleLoss: (pet: ActorWithAction) => {
      data.push(`You gather the remains of ${actorName(pet)} and run away.`);
    },
    battleVictory: (pet: ActorWithAction) => {
      data.push(
        `You and ${actorName(
          pet
        )} trod over the bodies of your fallen enemies as you continue on your way.`
      );
    },
    battleDraw: (pet: ActorWithAction) => {
      data.push(
        `You look out across the battlefield at the dead and broken. As you gather ${actorName(
          pet
        )}'s remains you wonder if anything really matters at all.`
      );
    },
    clear: () => {
      data = [];
    },
  };
};

export default battleLog;
