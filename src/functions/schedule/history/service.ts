import { queryHistory } from "@libs/host_database";
import { Host } from "src/models/host";
import { createLogger } from "@libs/logger";

export class HistoryService {

    constructor(private logger = createLogger('currenthost-service')) {}

    public async getHistory(user: string): Promise<Host[]> {

        this.logger.info(`look up for history for user ${user}`);

        const historyList = await queryHistory(user) as Host[];

        if(historyList.length == 0) {
            this.logger.info(`no history available for ${user}`);
        }

        return historyList;
    }

}