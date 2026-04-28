import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

export const storageRouter = router({
  getPresignedPutUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Note: storagePut already handles the presign + upload if we pass data.
      // But for frontend direct upload, we need just the URL.
      // However, the current storage.ts is designed for server-side use.
      // Let's adapt a bit or use a simpler approach.
      
      // For now, let's implement a simple upload endpoint that the frontend can use.
      // Or better, let's just use a direct upload to a server endpoint.
      return {
        // We'll implement a direct upload to /api/upload in server/_core/index.ts if needed,
        // but tRPC is better for consistency.
      };
    }),
    
  uploadBase64: protectedProcedure
    .input(
      z.object({
        base64: z.string(),
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, 'base64');
      const result = await storagePut(input.filename, buffer, input.contentType);
      return result;
    }),
});
