export function GetNew({ date }) {
    let today = new Date();
    if (date.getFullYear() === today.getFullYear()) {

        if (date.getMonth() !== today.getMonth()) {
            return `${today.getMonth() - date.getMonth()} months ago`;
        }

        if (date.getMonth() === today.getMonth()) {
            if (date.getDate() === today.getDate()) {
                if (date.getHours() === today.getHours()) {
                    return `${today.getMinutes() - date.getMinutes()} minutes ago`;
                }
                else if (date.getHours() !== today.getHours()) {
                    return `${today.getHours() - date.getHours()} hours ago`;
                }
            }
            else if (date.getDate() !== today.getDate()) {
                return `${today.getDate() - date.getDate()} days ago `;
            }
        }
    }

    else if (date.getFullYear() !== today.getFullYear()) {
        return `${today.getFullYear() - date.getFullYear()} years ago`;
    }
}
