import { Kafka } from "kafkajs";
import { MeiliSearch } from "meilisearch";

const kafka = new Kafka({
  clientId: "cdc-consumer",
  brokers: ["localhost:29092"],
});

const meiliClient = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: "testkey",
});

const consumer = kafka.consumer({ groupId: "cdc-consumer-group" });

await consumer.connect();
await consumer.subscribe({
  topic: "mysqlserver.appdb.users",
  fromBeginning: true,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (!message.value) return;

    const rawValue = message.value.toString();

    console.log("raw message:", rawValue);

    try {
      const event = JSON.parse(rawValue);
      if (event.payload) {
        const before = event.payload.before;
        const after = event.payload.after;
        const op = event.payload.op;

        console.log("Op:", op);
        console.log("before:", before);
        console.log("after:", after);

        switch (op) {
          case "c":
            await meiliClient.index("users").addDocuments([after]);
            break;

          case "u":
            const userFound = meiliClient.index("users");
            await userFound.addDocuments([after]);
            break;
          case "d":
            const indexFound = meiliClient.index("users");
            await indexFound.deleteDocument(before.id);
            break;

          default:
            console.error("Operation not found");
        }
      }
    } catch (err) {
      console.error("Failed to parse message: ", err);
    }
  },
});
