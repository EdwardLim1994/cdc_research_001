import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "cdc-consumer",
  brokers: ["localhost:29092"],
});

const consumer = kafka.consumer({ groupId: "cdc-consumer-group" });

await consumer.connect();
await consumer.subscribe({
  topic: "mysqlserver.appdb.users",
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log("topic", topic);
    console.log("partition", partition);
    console.log("message", message.value?.toString());
  },
});

