import { ActorWithAction } from "../../types/types";

const battleLog = () => {
  const data: string[] = [];

  const actorName = (actor: ActorWithAction) => {
    const isPet = "color" in actor;
    return `${isPet ? `${actor.name}` : `the ${actor.template.species.name}`}`;
  };

  return {
    data,
    actorDead: (actor: ActorWithAction) => {
      data.push(`It looks like ${actorName(actor)} isn't breathing...`);
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
    actorAttacked: (
      actor: ActorWithAction,
      target: ActorWithAction,
      didHit: boolean,
      didCrit: boolean,
      damage: number
    ) => {
      data.push(
        `${actorName(actor)} brutally attacked ${actorName(target)}. ${
          didHit
            ? `It ${
                didCrit ? "CRITICALLY " : ""
              }hit and did ${damage} health damage.`
            : "It missed..."
        }`
      );
    },
    actorInsulted: (
      actor: ActorWithAction,
      target: ActorWithAction,
      didHit: boolean,
      didCrit: boolean,
      damage: number
    ) => {
      data.push(
        `${actorName(actor)} viciously insulted ${actorName(target)}. ${
          didHit
            ? `${actorName(target)} was ${
                didCrit ? "CRITICALLY " : ""
              }crushed and took ${damage} mood damage.`
            : `${actorName(target)} wasn't listening...`
        }`
      );
    },
  };
};

export default battleLog;
