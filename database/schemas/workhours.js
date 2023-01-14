import mongoose from 'mongoose'

const WorkHourSchema = mongoose.Schema(
	{
		timein: {
			type: String,
			default: ''
		},
		timeout: {
			type: String,
			default: ''
		},
		created: {
			type: String,
			default: ''
		},
		updated: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

const WorkHours = mongoose.models.WorkHours || mongoose.model('WorkHours', WorkHourSchema)

export default WorkHours
