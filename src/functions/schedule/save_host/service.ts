import { saveNewHost } from "@libs/host_database";
import { updateMember } from "@libs/member_database";
import { Host } from "src/models/host";
import { Member } from "src/models/member";

export interface Body {
    memberId: string;
    nickName: string;
    image: string;
    start: string;
    end: string;
}

export class SaveHostService {

    constructor(private msPerDay = 1000*60*60*24) {}

    public async saveHost(user: string, body: Body) {

        const days = this.calculateDayRange(body.start, body.end);

        days.forEach(async (v, i) => {
            if(i+1 < days.length) {
                const start = this.splitDate(v);
                const end = this.splitDate(days[i+1]);

                await this.saveAsNewHost(user, body, start, end);
            }
        });

        await this.markMemberWasHost(user, body);
    }

    private splitDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    private calculateDayRange(start: string, end: string): Array<Date> {
        const startDay = new Date(Date.parse(start));
        const endDay = new Date(Date.parse(end));
        
        const diff = endDay.getTime() - startDay.getTime();
        const noDays = Math.ceil(diff / this.msPerDay);

        if(noDays <= 0) {
            throw new Error(`Given end date is before start day`);
        }
        
        const days: Date[] = Array.from(
            new Array(noDays + 1), 
            (_, i) => new Date(startDay.getTime() + (i * this.msPerDay))
        );
        
        return days;
    }

    private async saveAsNewHost(user: string, body: Body, start: string, end: string) {
        const newHost: Host = {
            userId: user,
            current: {
                userId: user,
                memberId: body.memberId,
                nickName: body.nickName,
                image: body.image
            },
            start: start,
            end: end,
            startAndEnd: `${start}--${end}`
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