import { Member } from "./member";

export interface History {
    userId: string;
    hostState: string;
    member: Member;
    start: string;
    end: string;
}