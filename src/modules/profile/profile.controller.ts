import Elysia from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { ProfileService } from "./profile.service";
import { UserProfileResponseSchema } from "../../interfaces/Profile";

export const ProfileController = new Elysia()
  .model({
    UserProfileResponse: UserProfileResponseSchema,
  })
  .use(authPlugin)
  .get(
    "/:userId",
    ({ params }) => ProfileService.findUserProfile(params.userId),
    {
      response: "UserProfileResponse",
    },
  );
