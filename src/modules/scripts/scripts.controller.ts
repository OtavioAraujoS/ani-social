import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { ScriptsService } from "./scripts.service";
import { SuccessResponseSchema } from "../../interfaces/Success";

export const ScriptsController = new Elysia().group("", (app) =>
  app
    .use(authPlugin)
    .model({
      SuccessResponse: SuccessResponseSchema,
    })
    .post(
      "/import-anime",
      ({ body, user }) =>
        ScriptsService.importAnimeFromUrl(body.url, user!.sub),
      {
        body: t.Object({
          url: t.String({ format: "uri" }),
        }),
        response: "SuccessResponse",
      },
    ),
);
