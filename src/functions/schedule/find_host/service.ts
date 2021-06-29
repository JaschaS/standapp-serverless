
import { createLogger } from "@libs/logger";
import { listAllMembers, patchMember } from "@libs/member_database";
import { Host } from "src/models/host";
import { Member } from "src/models/member";

export class FindHostService {

    constructor(private logger = createLogger('findhost-service')) {}

    public async findHost(user: string): Promise<Host> {

        // list all available members
        const allMembers = await listAllMembers(user) as Member[];
        if(allMembers.length == 0) {
            this.logger.error(`no members found for user ${user}`);
            throw new Error(`no members found for user ${user}`);
        }

        // filter out all members which where all ready host
        let availableHosts = allMembers.filter(m => !m.wasHost);

        // list empty fill up list again
        if(availableHosts.length == 0) {
            this.logger.info(`all members were already host for user user ${user} - reset`);
            allMembers.forEach(m => m.wasHost = false);

            // update members without waiting to return
            await this.updateMembers(allMembers);
            availableHosts = allMembers;
        }

        // pick one member
        const randMember = this.getRandomInt(availableHosts.length);

        // set today for start and end +1 
        const start = new Date();
        const end = new Date(start.getTime() + (1 * 24 * 60 * 60 * 1000));

        const startTime = this.splitDate(start);
        const endTime = this.splitDate(end);

        return {
            userId: user,
            current: availableHosts[randMember],
            start: startTime,
            end: endTime,
            startAndEnd: `${startTime}--${endTime}`
        };
    }

    private splitDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    private getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    private async updateMembers(members: Member[]) {
        members.forEach(async m => {
            await patchMember(m.nickName, m.image, m);
        });
    }

}