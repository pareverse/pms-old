import mongoose from 'mongoose'

const AttendanceSchema = mongoose.Schema(
	{
		user: {
			id: {
				type: String,
				default: ''
			}
		},
		workhours: {
			timein: {
				type: String,
				default: ''
			},
			timeout: {
				type: String,
				default: ''
			}
		},
		date: {
			type: String,
			default: ''
		},
		timein: {
			type: String,
			default: ''
		},
		timeout: {
			type: String,
			default: ''
		},
		earned: {
			type: String,
			default: '0'
		},
		status: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
)

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema)

export default Attendance
