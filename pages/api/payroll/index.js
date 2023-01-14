import connect from 'database/connect'
import Users from 'database/schemas/users'
import Attendance from 'database/schemas/attendance'
import Payroll from 'database/schemas/payroll'

export default async (req, res) => {
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Payroll.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body

				data.attendance.map(async (att) => {
					await Attendance.findByIdAndUpdate(
						{ _id: att._id },
						{
							status: true
						}
					)
				})

				await Payroll.create({
					user: data.user,
					date: data.date,
					amount: data.amount,
					attendance: data.attendance,
					deduction: data.deduction,
					created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				})

				await Users.findByIdAndUpdate(
					{ _id: data.user.id },
					{
						activities: {
							id: '',
							started: ''
						},
						balance: '0',
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		default:
			res.status(400).send('request failed.')
			break
	}
}
