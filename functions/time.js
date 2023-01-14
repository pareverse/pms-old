export const format = (time) => {
	if (Number(time.split(':')[0]) < 12) {
		if (Number(time.split(':')[0]) === Number('00')) {
			return `${12 + ':' + time.split(':')[1]} AM`
		} else {
			return `${time.split(':')[0] + ':' + time.split(':')[1]} AM`
		}
	} else {
		if (Number(time.split(':')[0]) === 12) {
			return `${time} PM`
		} else {
			if (Number(time.split(':')[0]) - 12 < 10) {
				return `${'0' + (time.split(':')[0] - 12).toString() + ':' + time.split(':')[1]} PM`
			} else {
				return `${time.split(':')[0] - 12 + ':' + time.split(':')[1]} PM`
			}
		}
	}
}
