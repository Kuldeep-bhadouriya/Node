import { protectedProcedure, publicProcedure, router } from "../index";
import { studentRouter } from "./student";

export const appRouter = router({
  student: studentRouter,
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});
export type AppRouter = typeof appRouter;
