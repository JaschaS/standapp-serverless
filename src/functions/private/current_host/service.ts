import { getCurrentHost } from "@libs/host_database";
import { Host } from "src/models/host";
import { CurrentHost } from "src/models/current_host";
import { createLogger } from "@libs/logger";

export class sCurrentHostService {

    constructor(private logger = createLogger('currenthost-service')) {}

    public async getCurrentHost(user: string): Promise<CurrentHost> {

        this.logger.info(`look up for host for user ${user}`);

        const hostList: Host[] = await getCurrentHost(user) as Host[];

        if(hostList.length == 0) {
            this.logger.info(`no host find for user ${user}`);
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