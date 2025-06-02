// app/api/inngest/route.ts (or .js if you're not using TypeScript)

import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Serve Inngest functions via API routes
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion,
    ],
});
