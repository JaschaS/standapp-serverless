import { queryHistory } from "@libs/host_database";
import { createLogger } from "@libs/logger";
import { History } from "src/models/history";

export class HistoryService {

    constructor(private logger = createLogger('currenthost-service')) {}

    public async getHistory(user: string): Promise<History[]> {

        this.logger.info(`look up for history for user ${user}`);

        const historyList = await queryHistory(user) as History[];

        if(historyList.length == 0) {
            this.logger.info(`no history available for ${user}`);
        }

        return historyList;
    }

}