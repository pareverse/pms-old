export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const convertDate = (dateString) => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const date = new Date(dateString)
	const month = months[date.getMonth()]
	const day = date.getDate()
	const year = date.getFullYear()
	return `${month} ${day}, ${year}`
}
