# CDC Research using Kafka Connect & Debezium

## Purpose

To explore Change Data Capture (CDC) using Kafka Connect and Debezium with a MySQL database. By consuming message published by Debezium, the data cahnged will create, update and delete index in Meilisearch

## Software used

- Debezium
- Apache Kafka
- Mysql
- Meilisearch

## Prerequisite

### Curl to setup MYSQL connector

```
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mysql-connector",
    "config": {
      "connector.class": "io.debezium.connector.mysql.MySqlConnector",
      "tasks.max": "1",
      "database.hostname": "mysql",
      "database.port": "3306",
      "database.user": "app",
      "database.password": "app",
      "database.server.id": "184054",
      "topic.prefix": "mysqlserver",
      "database.include.list": "appdb",
      "include.schema.changes": "true",
      "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
      "schema.history.internal.kafka.topic": "schema-changes.appdb"
    }
  }'
```
