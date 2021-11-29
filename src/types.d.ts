import { response } from "express";
import { IUser } from "./models/user";

declare global {
    namespace Express {
        export interface User extends IUser {}
        interface Response {
            sendMessage: (level: "info" | "alert" | "warn", message: string, timeout?: number) => void;
        }
    }
}