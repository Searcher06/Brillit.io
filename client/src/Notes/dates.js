let today = new Date()
export const thisYear = () => { // publish after
    return new Date(today.getFullYear(), 0o0, 0o1).toISOString()
}

export const nextYear = () => {
    return new Date(today.getFullYear() + 1, 0o0, 0o1) // publish before
}

export const thisMonth = () => { // publish before && publish after
    return today.toISOString()
}