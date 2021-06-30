import { saveNewHost } from "@libs/host_database";
import { updateMember } from "@libs/member_database";
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
        await this.saveAsNewHost(user, body);
        await this.markMemberWasHost(user, body);
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