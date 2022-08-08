import { MachineOptions, assign, spawn, send } from "xstate";

import { IContext } from "./types";

import { spawn as spawnSocketServer } from "@xstate-machines/socket-server/";
import { spawn as spawnKafkaProducer } from "@xstate-machines/kafkajs-producer";
import { spawn as spawnKafkaConsumer } from "@xstate-machines/kafkajs-consumer";

import { ENDPOINT_PRODUCER_TOPIC } from "../utils/env";

const DATE_START = new Date().toISOString();
const END_POINT = "END POINT";

export const implementation: MachineOptions<IContext, any> = {
  actions: {
    logSpawnningSocketServer: () =>
      console.log(`[${DATE_START}][${END_POINT}]: #logSpawnningSocketServer`),
    logSendToSocketServerToEmitResponse: (_, event) => {
      console.log(
        `[${DATE_START}][${END_POINT}]: logSendToSocketServerToEmitResponse`,
        event
      );
    },

    logProduceToWorkflow: (_, event) => {
      console.log(`[${DATE_START}][${END_POINT}]: logProduceToWorkflow`, event);
    },

    spawnSocketServer: assign({
      socket_server_instance: ({ socket_server }) => {
        const { socket_config, sockets } = socket_server;
        const instance = spawnSocketServer({ socket_config, sockets });
        return spawn(instance);
      },
    }),

    produceToWorkflow: send(
      (_, event: any): any => {
        const { payload, session_id } = event;
        return {
          type: "SEND_TO_TOPIC",
          topic: ENDPOINT_PRODUCER_TOPIC,
          message: { session_id, ...payload },
        };
      },
      { to: "kafka-producer" }
    ),
    // sendToSocketServerToEmitResponse: send(
    //   (_, event: any) => {
    //     return {
    //       type: "SEND",
    //       payload: event,
    //     };
    //   },
    //   { to: ({ socket_server_instance }) => socket_server_instance }
    // ),
    sendToSocketServerToEmitResponse: send(
      (_, { payload }: any) => {
        // const { session, session_id, ...new_payload } = payload;
        // console.log("asdsadasda", payload, new_payload);
        return {
          type: "SEND",
          payload,
        };
      },
      { to: ({ socket_server_instance }) => socket_server_instance }
    ),
  },
  activities: {},
  delays: {},
  services: {
    kafkaProducer: ({ kafka_producer_config }) => {
      return spawnKafkaProducer(kafka_producer_config);
    },
    kafkaConsumer: ({ kafka_consumer_config }) => {
      return spawnKafkaConsumer(kafka_consumer_config);
    },
  },
  guards: {
    checkSessionId: (_, { payload: { session_id } }) => {
      return session_id ? true : false;
    },
  },
};
