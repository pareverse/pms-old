import connect from 'database/connect'
import Users from 'database/schemas/users'
import Attendance from 'database/schemas/attendance'

export default async (req, res) => {
	await connect()

	try {
		const { data } = req.body

		const user = await Users.findById({ _id: data.user.id })

		await Attendance.findByIdAndUpdate(
			{ _id: user.activities.id },
			{
				timeout: data.timeout,
				earned: data.earned
			}
		)

		await Users.findByIdAndUpdate(
			{ _id: data.user.id },
			{
				activities: {
					id: user.activities.id,
					started: ''
				},
				balance: Number(user.balance) + Number(data.earned),
				updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
			}
		)

		res.status(200).send('request success.')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
