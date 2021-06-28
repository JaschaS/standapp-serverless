import { Member } from "./member";

export interface Host {
    userId: string;
    current: Member;
    start: string;
    end: string;
    startAndEnd: string;
}