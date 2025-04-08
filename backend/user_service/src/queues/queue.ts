import { User } from "../models/user.model";
import { publishToQueue, subscribeToQueue } from "../service/rabbit";

export const queues = () => {
    subscribeToQueue("blog:create", async (data) => {
        const userId = JSON.parse(data);

        const user = await User.findById(userId).select("-password -refreshToken -__v");

        if (!user) {
            console.error("User not found");
            return;
        }
        console.log("User data from blog service:", user);

        publishToQueue("userInfo", JSON.stringify(user));
    });
}