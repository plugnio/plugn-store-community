import { useI18n } from "vue-i18n";

 export function toDuration(time: number, time_unit: any = "min"): string {

    let min; 

    switch (time_unit) {
        case "min":
            min = time;
            break;
        case "hrs":
            min = time * 60;
            break;
        case "day":
            min = time * 60 * 24;
            break;
        default:
            console.error("no time unit found")
            min = time;
            break;
    }

    const { t } = useI18n({ useScope: "global" });

    let start ;
    start = new Date();

    let end;
    end = new Date();
    end = new Date(end.getTime() + min * 60000);
    
    let diffInMilliSeconds = Math.abs(end - start) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    if (days > 0){
        difference += (days === 1) ?  t('Tomorrow') : t('{days} days', { days: days });
    }
    
    if(days > 0 && hours > 0)
        difference += ', ';
    else if(days > 0 && minutes > 0)
        difference += ', ';

    if(hours > 0){
        difference += (hours === 0 || hours === 1) ? 
            t('{hours} hour', { hours: hours }) : t('{hours} hours', { hours: hours });
    }
    
    if(hours > 0 && minutes > 0)
        difference += ', ';

    if(minutes > 0)
        difference += t('{minutes} minutes', { minutes: minutes });

    return difference;
}
