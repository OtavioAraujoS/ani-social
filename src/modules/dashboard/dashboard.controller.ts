import { Elysia } from "elysia";
import { authPlugin } from "../auth/auth.middleware";
import { DashboardService } from "./dashboard.service";

export const DashboardController = new Elysia({ prefix: "/dashboard" })
  .use(authPlugin)
  .get("/", () => DashboardService.getDashboardData());
