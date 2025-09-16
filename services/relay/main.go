package main

import (
	"context"
	"fmt"
	"log"

	"github.com/segmentio/kafka-go"
)

func main() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{"localhost:29092"},
		Topic:    "mysqlserver.appdb.users",
		GroupID:  "cdc-consumer-group",
		MinBytes: 10e3,
		MaxBytes: 10e6,
	})

	fmt.Println("Starting Kafka consumer...")

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Fatalf("could not read message: %v", err)
		}

		fmt.Printf("Message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))
	}
}
