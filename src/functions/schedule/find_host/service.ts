
import { listAllMembers, patchMember } from "@libs/member_database";
import { Host } from "src/models/host";
import { Member } from "src/models/member";

export class FindHostService {

    public async findHost(user: string): Promise<Host> {

        // list all available members
        const allMembers = await listAllMembers(user) as Member[];
        if(allMembers.length == 0) {
            throw new Error(`find members found for user ${user}`);
        }

        // filter out all members which where all ready host
        const availableHosts = allMembers.filter(m => !m.wasHost);

        // list empty fill up list again
        if(availableHosts.length == 0) {
            availableHosts.forEach(m => m.wasHost = false);

            // update members without waiting to return
            this.updateMembers(availableHosts);
        }

        // pick one member
        const randMember = this.getRandomInt(availableHosts.length);

        // set today for start and end +1 
        const start = new Date();
        const end = new Date(start.getTime() + (1 * 24 * 60 * 60 * 1000));

        return {
            userId: user,
            current: availableHosts[randMember],
            start: start.toISOString(),
            end: end.toISOString(),
            startAndEnd: `${start.toISOString()}--${end.toISOString()}`
        };
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