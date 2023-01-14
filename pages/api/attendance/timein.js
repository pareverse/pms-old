import connect from 'database/connect'
import Users from 'database/schemas/users'
import Attendance from 'database/schemas/attendance'

export default async (req, res) => {
	await connect()

	try {
		const { data } = req.body

		const user = await Users.findById({ _id: data.user.id })

		if (user.activities.id) {
			const attendance = await Attendance.findById({ _id: user.activities.id })

			if (attendance.date === data.date) {
				await Attendance.findByIdAndUpdate(
					{ _id: attendance._id },
					{
						timeout: '',
						earned: '0'
					}
				)

				await Users.findByIdAndUpdate(
					{ _id: user._id },
					{
						activities: {
							id: attendance._id,
							started: attendance.timein
						},
						balance: Number(user.balance) - Number(attendance.earned),
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)
			}
		} else {
			const attendance = await Attendance.create({
				user: data.user,
				workhours: {
					timein: data.workhours.timein,
					timeout: data.workhours.timeout
				},
				date: data.date,
				timein: data.timein
			})

			await Users.findByIdAndUpdate(
				{ _id: data.user.id },
				{
					activities: {
						id: attendance._id,
						started: attendance.timein
					},
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				}
			)
		}

		res.status(200).send('request success.')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
