import { getHostByDate } from "@libs/host_database";
import { Host } from "src/models/host";
import { CurrentHost } from "src/models/current_host";

export class CurrentHostService {

    public async getCurrentHost(user: string, start?: string, end?: string): Promise<CurrentHost> {

        const startDate = this.convertStart(start);
        const endDate = this.convertEnd(end);
        const hostList: Host[] = await getHostByDate(user, startDate, endDate) as Host[];

        if(hostList.length == 0) {
            return this.emptyHost();
        }

        const currentHost = hostList[0];

        return {
            ...currentHost.current,
            end: currentHost.end,
            start: currentHost.start
        };
    }

    private convertStart(start?: string) {
        if(start) return start;

        const newStart = new Date();
        return newStart.toISOString();
    }

    private convertEnd(end?: string) {
        if(end) return end;

        const today = new Date(Date.now());
        const newEnd = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
        return newEnd.toISOString();
    }

    private emptyHost(): CurrentHost {
        return {
            userId: "",
            memberId: "",
            start: "",
            end: "",
            image: "",
            nickName: ""
        };
    }
}