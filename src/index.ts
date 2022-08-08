import { interpret } from "xstate";
import { spawn as spawnParent } from "./machines";

import {
  KAFKA_BROKER_LIST,
  ENDPOINT_PRODUCER_ID,
  ENDPOINT_CONSUMER_ID,
  ENDPOINT_CONSUMER_GROUP_ID,
  ENDPOINT_CONSUMER_TOPIC,
  ENDPOINT_METADATA_MAX_AGE,
  ENDPOINT_AUTO_TOPIC_CREATION,
  ENDPOINT_TRANSACTION_TIMEOUT,
  SOCKET_PORT,
} from "./utils/env";

const service = interpret(
  spawnParent({
    socket_server: {
      socket_config: {
        port: SOCKET_PORT,
      },
      sockets: {},
    },
    // socket_server: {
    //   socket_config: {
    //     port: SOCKET_PORT,
    //   },
    // },
    kafka_consumer_config: {
      consumer: null,
      kafka: null,
      brokers: KAFKA_BROKER_LIST.split(","),
      clientId: ENDPOINT_CONSUMER_ID,
      config: {
        groupId: ENDPOINT_CONSUMER_GROUP_ID,
      },
      topic: ENDPOINT_CONSUMER_TOPIC,
    },
    kafka_producer_config: {
      brokers: KAFKA_BROKER_LIST.split(","),
      clientId: ENDPOINT_PRODUCER_ID,
      config: {
        metadataMaxAge: Number(ENDPOINT_METADATA_MAX_AGE),
        allowAutoTopicCreation: Boolean(ENDPOINT_AUTO_TOPIC_CREATION),
        transactionTimeout: Number(ENDPOINT_TRANSACTION_TIMEOUT),
      },
      kafka: null,
      producer: null,
    },
  })
);

service.start();
