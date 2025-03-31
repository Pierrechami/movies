export const schemas = {
    Movie: {
      type: "object",
      properties: {
        _id: { type: "string" },
        plot: { type: "string" },
        genres: { type: "array", items: { type: "string" } },
        runtime: { type: "integer" },
        cast: { type: "array", items: { type: "string" } },
        poster: { type: "string" },
        title: { type: "string" },
        fullplot: { type: "string" },
        languages: { type: "array", items: { type: "string" } },
        released: { type: "string", format: "date-time" },
        directors: { type: "array", items: { type: "string" } },
        rated: { type: "string" },
        awards: {
          type: "object",
          properties: {
            wins: { type: "integer" },
            nominations: { type: "integer" },
            text: { type: "string" },
          },
        },
        lastupdated: { type: "string" },
        year: { type: "integer" },
        imdb: {
          type: "object",
          properties: {
            rating: { type: "number" },
            votes: { type: "integer" },
            id: { type: "integer" },
          },
        },
        countries: { type: "array", items: { type: "string" } },
        type: { type: "string" },
        tomatoes: {
          type: "object",
          properties: {
            viewer: {
              type: "object",
              properties: {
                rating: { type: "number" },
                numReviews: { type: "integer" },
                meter: { type: "integer" },
              },
            },
            fresh: { type: "integer" },
            critic: {
              type: "object",
              properties: {
                rating: { type: "number" },
                numReviews: { type: "integer" },
                meter: { type: "integer" },
              },
            },
            rotten: { type: "integer" },
            lastUpdated: { type: "string", format: "date-time" },
          },
        },
        num_mflix_comments: { type: "integer" },
      },
    },
  
    MovieDetailResponse: {
      type: "object",
      properties: {
        status: { type: "integer", example: 200 },
        data: {
          type: "object",
          properties: {
            movie: {
              $ref: "#/components/schemas/Movie",
            },
          },
        },
      },
    },
  
    ErrorResponse: {
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        error: { type: "string", nullable: true },
      },
    },
  
    Comment: {
      type: "object",
      properties: {
        _id: { type: "string", example: "5a9427648b0beebeb69579e7" },
        name: { type: "string", example: "Mercedes Tyler" },
        email: { type: "string", example: "mercedes_tyler@fakegmail.com" },
        movie_id: { type: "string", example: "573a1390f29313caabcd4323" },
        text: { type: "string", example: "Très bon film !" },
        date: { type: "string", format: "date-time", example: "2025-03-31T12:00:00Z" }
      }
    },
  
    CommentInput: {
      type: "object",
      required: ["name", "email", "text"],
      properties: {
        name: { type: "string", example: "Jean Dupont" },
        email: { type: "string", example: "jean.dupont@example.com" },
        text: { type: "string", example: "Excellent film !" }
      }
    },
  
    TheaterInput: {
      type: "object",
      required: ["location"],
      properties: {
        location: {
          type: "object",
          properties: {
            address: {
              type: "object",
              properties: {
                street1: { type: "string", example: "123 Rue des Lilas" },
                city: { type: "string", example: "Paris" },
                state: { type: "string", example: "Île-de-France" },
                zipcode: { type: "string", example: "75000" }
              }
            },
            geo: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["Point"], example: "Point" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  minItems: 2,
                  maxItems: 2,
                  example: [2.3522, 48.8566]
                }
              }
            }
          }
        }
      }
    }
  };
  