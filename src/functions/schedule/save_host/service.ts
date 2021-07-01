import { getCurrentHost, saveNewHost, toHistory } from "@libs/host_database";
import { updateMember } from "@libs/member_database";
import { History } from "src/models/history";
import { Host } from "src/models/host";
import { HostState } from "src/models/host_state";
import { Member } from "src/models/member";

export interface Body {
    memberId: string;
    nickName: string;
    image: string;
    start: string;
    end: string;
}

export class SaveHostService {

    public async saveHost(user: string, body: Body) {

        const currentHost = await this.retrieveCurrentHost(user);

        if(currentHost != null) {
            await this.saveHistory(user, currentHost);
        }

        await this.saveAsNewHost(user, body);
        await this.markMemberWasHost(user, body);
    }

    private async saveHistory(user: string, host: Host) {

        const history: History = {
            start: host.start,
            end: host.end,
            member: host.current,
            userId: user,
            hostState: `${HostState.History}#${host.current.memberId}`
        };

        await toHistory(history);
    }

    private async retrieveCurrentHost(user: string): Promise<Host> {
        const hostList: Host[] = await getCurrentHost(user) as Host[];

        if(hostList.length == 0) {
            return null;
        }

        return hostList[0];
    }

    private async saveAsNewHost(user: string, body: Body) {
        const newHost: Host = {
            userId: user,
            current: {
                userId: user,
                memberId: body.memberId,
                nickName: body.nickName,
                image: body.image
            },
            start: body.start,
            end: body.end,
            hostState: HostState.CurrentHost
        }

        await saveNewHost(newHost)
    }

    private async markMemberWasHost(user: string, body: Body) {
        const member: Member = {
            nickName: body.nickName,
            image: body.image,
            userId: user,
            memberId: body.memberId,
            wasHost: true
        };
        
        await updateMember(member);
    }

}