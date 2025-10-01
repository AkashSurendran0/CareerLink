import { elasticClient } from "../utils/ElasticClient";

async function createUserIndex() {
  const exists = await elasticClient.indices.exists({ index: "users" });

  if (!exists) {
    await elasticClient.indices.create({
      index: "users",
      settings: {
        analysis: {
          analyzer: {
            autocomplete: {
                type:"custom",
              tokenizer: "autocomplete",
              filter: ["lowercase"]
            }
          },
          tokenizer: {
            autocomplete: {
              type: "edge_ngram",
              min_gram: 1,
              max_gram: 20,
              token_chars: ["letter"]
            }
          }
        }
      },
      mappings: {
        properties: {
          id: { type: "keyword" },
          username: {
            type: "text",
            analyzer: "autocomplete",       // use custom analyzer for indexing
            search_analyzer: "standard"     // use standard analyzer for search
          },
          email: { type: "keyword" },
          createdAt: { type: "date" },
          suspended: { type: "boolean" }
        }
      }
    });

    console.log("✅ user index created with autocomplete analyzer");
  } else {
    console.log("⚠️ user index already exists");
  }
}

createUserIndex().catch(console.error);
