export const results = (start_date, end_date) => {
	// Parse the date strings using Date.parse()
	var startDate = new Date(Date.parse(start_date))
	var endDate = new Date(Date.parse(end_date))

	// Calculate the difference in milliseconds
	var diff = endDate - startDate

	// Calculate the number of hours, minutes, and seconds
	var hours = Math.floor(diff / (1000 * 60 * 60))
	var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
	var seconds = Math.floor((diff % (1000 * 60)) / 1000)

	// Return the difference as an object
	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds
	}
}
