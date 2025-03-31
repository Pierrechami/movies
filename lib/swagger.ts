import { createSwaggerSpec } from "next-swagger-doc";
import { schemas } from "@/swagger/components";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", 
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas,
      },
      security: [],
    },
  });

  return spec;
};
