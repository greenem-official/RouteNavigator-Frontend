import type {Moment} from "moment-timezone";

export interface AuthData {
    userUsername: string,
    userEmail: string,
    token: string,
    expires: Moment
}