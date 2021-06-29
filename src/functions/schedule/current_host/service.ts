import { getHostByDate } from "@libs/host_database";
import { Host } from "src/models/host";
import { CurrentHost } from "src/models/current_host";
import { createLogger } from "@libs/logger";


// TODO: if start date is null generate end date as well
// TODO: if end date is not given generate it from start date + 1

export class CurrentHostService {

    constructor(private logger = createLogger('currenthost-service')) {}

    public async getCurrentHost(user: string, start?: string, end?: string): Promise<CurrentHost> {

        this.logger.info(`look up for host for user ${user} from ${start} until ${end}`);

        let startDate = start;
        let endDate = end;
        if(startDate == null) {
            startDate = this.newStart();
            endDate = this.updateEnd(startDate);
        }
        else {
            if(endDate == null) {
                endDate = this.updateEnd(startDate);
            }
        }
        const hostList: Host[] = await getHostByDate(user, startDate, endDate) as Host[];

        if(hostList.length == 0) {
            this.logger.info(`no host find for user ${user} from ${startDate} until ${endDate}`);
            return this.emptyHost();
        }

        const currentHost = hostList[0];
        this.logger.info(`host found for user ${user} -- ${currentHost}`);

        return {
            ...currentHost.current,
            end: currentHost.end,
            start: currentHost.start
        };
    }

    private newStart() {
        const newStart = new Date();
        return this.splitDate(newStart);
    }

    private updateEnd(start: string) {
        // use T02:00:00 because of utc time - otherwise the time may be the day before
        // e.g. 2021-06-01T00:00:00 would be 2021-05-31T22:00:00

        const today = new Date(Date.parse(`${start}T02:00:00`));
        const newEnd = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
        return this.splitDate(newEnd);
    }

    private splitDate(date: Date): string {
        return date.toISOString().split("T")[0];
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