export namespace System {

    export const COMMAND_PREFIXES : string[] = ['!', '/', '.', '$', '%', '+']
    export const BANWORDS : string[] = [
        'шлюха', 'mq', 'даун', 'долбаеб', 'конченный',
        'уебок', 'безмамный', 'шлюх', 'дауниха', 'долбаебка',
        'конченная', 'уебище', 'безмамная', 'конченное', 'безмамное',
        'rnq'
    ]

    export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

}