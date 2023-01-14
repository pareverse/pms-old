export const timeinStatus = (time1, time2) => {
	// Convert time1 and time2 to Date objects
	const date1 = new Date(`1970-01-01 ${time1}`)
	const date2 = new Date(`1970-01-01 ${time2}`)

	// Compare the two times
	if (date1.getTime() + 5 * 60 * 1000 <= date2.getTime()) {
		return 'late'
	} else {
		return 'ontime'
	}
}

export const timeoutStatus = (time1, time2) => {
	// Convert time1 and time2 to Date objects
	const date1 = new Date(`1970-01-01 ${time1}`)
	const date2 = new Date(`1970-01-01 ${time2}`)

	// Compare the two times
	if (date1.getTime() + 5 * 60 * 1000 <= date2.getTime()) {
		return 'overtime'
	} else {
		return 'ontime'
	}
}
