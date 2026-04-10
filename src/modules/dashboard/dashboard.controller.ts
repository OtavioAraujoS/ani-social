import { DashboardService } from "./dashboard.service";
import { DashboardResponseSchema } from "../../interfaces/Dashboard";
import { authPlugin } from "../auth/auth.middleware";
import { Elysia } from "elysia";

export const DashboardController = new Elysia()
  .use(authPlugin)
  .model({
    DashboardResponse: DashboardResponseSchema,
  })
  .get("/", () => DashboardService.getDashboardData(), {
    response: "DashboardResponse",
  });
