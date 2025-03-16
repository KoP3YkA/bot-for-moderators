export class Time {

    public constructor(
        public time: Date
    ) {}

    public static get currency() : Time {
        return new Time(new Date());
    }

    private get values() : {day: string, month: string, year: number, hours: string, minutes: string, seconds: string} {
        const day = String(this.time.getDate()).padStart(2, '0');
        const month = String(this.time.getMonth() + 1).padStart(2, '0');
        const year = this.time.getFullYear();
        const hours = String(this.time.getHours()).padStart(2, '0');
        const minutes = String(this.time.getMinutes()).padStart(2, '0');
        const seconds = String(this.time.getSeconds()).padStart(2, '0');

        return {day, month, year, hours, minutes, seconds};
    }

    public get toString() : string {
        const { day, month, year, hours, minutes, seconds } = this.values;
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    public get toDateString() : string {
        const { day, month, year, hours, minutes, seconds } = this.values;
        return `${day}/${month}/${year}`;
    }

    public getDaysDifference(): number;
    public getDaysDifference(date: Date): number;
    public getDaysDifference(date: number): number;
    public getDaysDifference(date?: Date | number): number {
        const currentDate = new Date();

        let timeDifference: number;

        if (date === undefined) {
            timeDifference = currentDate.getTime() - this.time.getTime();
        } else if (date instanceof Date) {
            timeDifference = this.time.getTime() - date.getTime();
        } else if (typeof date === 'number') {
            timeDifference = currentDate.getTime() - (this.time.getTime() + date);
        } else {
            timeDifference = currentDate.getTime() - this.time.getTime();
        }

        return Math.floor(timeDifference / (1000 * 3600 * 24));
    }

    public get getAccurateDifference(): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - this.time.getTime()) / 1000);

        const days = Math.floor(diffInSeconds / (60 * 60 * 24));
        const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        const seconds = diffInSeconds % 60;

        let result = '';
        if (days > 0) result += `${days} дней `;
        if (hours > 0) result += `${hours} часов `;
        if (minutes > 0) result += `${minutes} минут `;
        result += `${seconds} секунд`;

        return result;
    }

    public isExpired(time: number) : boolean {
        if (time === 0) return false;
        const difference : number = this.getDaysDifference(time)
        return difference <= 0
    }

    public static toDate(str: string) : Time | null {
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

        if (!datePattern.test(str)) return null;

        const [day, month, year] = str.split('.').map(Number);

        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) return null;

        return new Time(date);
    }

}