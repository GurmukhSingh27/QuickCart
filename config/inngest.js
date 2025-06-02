import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

// Sync user creation
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address ?? "",
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
            imageUrl: image_url,
        };

        await connectDB();
        const existingUser = await User.findById(id);
        if (!existingUser) {
            try {
                await User.create(userData);
            } catch (err) {
                console.error("Error creating user:", err);
                throw err;
            }
        }
    }
);

// Sync user update
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            email: email_addresses?.[0]?.email_address ?? "",
            name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
            imageUrl: image_url,
        };

        await connectDB();
        try {
            await User.findByIdAndUpdate(id, userData, { new: true });
        } catch (err) {
            console.error("Error updating user:", err);
            throw err;
        }
    }
);

// Sync user deletion
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;

        await connectDB();
        try {
            await User.findByIdAndDelete(id);
        } catch (err) {
            console.error("Error deleting user:", err);
            throw err;
        }
    }
);
