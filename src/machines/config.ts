export const config = {
  id: "endpoint_tester",
  initial: "start",
  entry: ["logSpawnningSocketServer", "spawnSocketServer"],
  states: {
    start: {
      invoke: [
        {
          id: "kafka-producer",
          src: "kafkaProducer",
        },
        {
          id: "kafka-consumer",
          src: "kafkaConsumer",
        },
      ],
      on: {
        MESSAGE: {
          actions: ["logProduceToWorkflow", "produceToWorkflow"],
        },
        WORKFLOW_RESPONSE: [
          {
            cond: "checkSessionId",
            actions: [
              "logSendToSocketServerToEmitResponse",
              "sendToSocketServerToEmitResponse",
            ],
          },
          {
            actions: () => console.log("No session id"),
          },
        ],
        ///////
        // COMPONENT: [
        //   {
        //     cond: "checkSessionId",
        //     actions: [
        //       "logSendToSocketServerToEmitResponse",
        //       "sendToSocketServerToEmitResponse",
        //     ],
        //   },
        // ],
        // TOAST_MESSAGE: [
        //   {
        //     cond: "checkSessionId",
        //     actions: [
        //       "logSendToSocketServerToEmitResponse",
        //       "sendToSocketServerToEmitResponse",
        //     ],
        //   },
        // ],
        // "*": {
        //   actions: (_: any, e: any) =>
        //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", e),
        // },
        // WORKFLOW_RESPONSE: {
        //   actions: [
        //     "logSendToSocketServerToEmitResponse",
        //     "sendToSocketServerToEmitResponse",
        //     (_: any, e: any) => console.log("SERVERRRR", e),
        //   ],
        // },
      },
    },
  },
};
