import { ActorWithAction } from "../../types/types";

const battleLog = () => {
  const log: string[] = [];

  const actorName = (actor: ActorWithAction) => {
    const isPet = "color" in actor;
    return `${isPet ? `${actor.name}` : `the ${actor.template.species.name}`}`;
  };

  return {
    actorDead: (actor: ActorWithAction) => {
      log.push(`It looks like ${actorName(actor)} isn't breathing...`);
    },
    actorMindless: (actor: ActorWithAction) => {
      log.push(
        `It looks like ${actorName(actor)} isn't aware of its surroundings...`
      );
    },
    actorAshes: (actor: ActorWithAction) => {
      log.push(`All that remains of ${actorName(actor)} is a pile of ash...`);
    },
    actorTurn: (actor: ActorWithAction) => {
      log.push(`${actorName(actor)} prepares to act.`);
    },
    actorAttacked: (
      actor: ActorWithAction,
      target: ActorWithAction,
      didHit: boolean,
      didCrit: boolean,
      damage: number
    ) => {
      log.push(
        `${actorName(actor)} attacked ${actorName(target)}. ${
          didHit
            ? `It ${
                didCrit ? "CRITICALLY " : ""
              }hit and did ${damage} health damage.`
            : "It missed..."
        }`
      );
    },
  };
};

export default battleLog;
