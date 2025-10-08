import { elasticClient } from "../utils/ElasticClient";

async function createCompanyIndex() {
  const exists = await elasticClient.indices.exists({ index: "companies" });

  if (!exists) {
    await elasticClient.indices.create({
      index: "companies",
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
          logo: {type: "keyword"},
          name: {
            type: "text",
            analyzer: "autocomplete",       // use custom analyzer for indexing
            search_analyzer: "standard"     // use standard analyzer for search
          },
          createdAt: { type: "date" },
          suspended: { type: "boolean" }
        }
      }
    });

    console.log("✅ company index created with autocomplete analyzer");
  } else {
    console.log("⚠️ company index already exists");
  }
}

createCompanyIndex().catch(console.error);