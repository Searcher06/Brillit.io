import { Duration } from "luxon";

export default function FormatYouTubeDuration({ isoDuration }) {
    const duration = Duration.fromISO(isoDuration);

    const hours = duration.hours;
    const minutes = duration.minutes;
    const seconds = duration.seconds;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
}
