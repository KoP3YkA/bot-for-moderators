import {Time} from "./Time";

export class Logging {

    public static LOGS : Set<string> = new Set();

    private static setLog(logType: string, info: any) : void {
        this.LOGS.add(`[${logType}] [${Time.currency.toString}] ${info}`)
    }

    public static info(info: any) : void {
        this.setLog('INFO', info)
        console.log(`[${Time.currency.toString}] ${info}`)
    }
    public static log(info: any) : void {
        this.setLog('DEBUG', info)
        console.log(info);
    }

    public static warn(info: any) : void {
        this.setLog('WARN', info)
        console.log(info);
    }

}