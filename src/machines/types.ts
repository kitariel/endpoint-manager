import { IContext as SocketContextConfig } from "@xstate-machines/socket-server/machines/socket-server/types";
import { Context as KafkaConsumerConfig } from "@xstate-machines/kafkajs-consumer/machine/types";
import { Context as KafkaProducerConfig } from "@xstate-machines/kafkajs-producer/machine/types";

export interface IContext {
  socket_server: SocketContextConfig;
  kafka_consumer_config: KafkaConsumerConfig;
  kafka_producer_config: KafkaProducerConfig;
  socket_server_instance?: any;
}
