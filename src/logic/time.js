// expect time in seconds
export const diferenceBetweenTimestamps = (start, end) => {
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    console.log(startTimestamp, endTimestamp);
    return endTimestamp - startTimestamp;
}

export const prepareForDisplay = (time) => {

    const years = Math.floor((time / (60 * 60 * 24 * 7 * 4 * 12)));

    if(years > 0) return `${years}y`;

    const months = Math.floor((time / (60 * 60 * 24 * 7 * 4)));

    if(months < 12 && months > 0) return `${months}m`;

    const weeks = Math.floor((time / (60 * 60 * 24 * 7)));

    if(weeks < 4 && weeks > 0) return `${weeks}w`;

    const days = Math.floor((time / (60 * 60 * 24)));

    if(days < 7 && days > 0) return `${days}d`;

    const hours = Math.floor((time / (60 * 60)));

    if(hours < 24 && hours > 0) return `${hours}h`;

    const minutes = Math.floor((time / (60)));

    if(minutes < 60 && minutes > 0) return `${minutes}min`;

    const seconds = Math.floor((time));

    if(seconds < 60 && seconds > 0) return `now`;
    
}
