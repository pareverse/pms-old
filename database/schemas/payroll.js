import mongoose from 'mongoose'

const PayrollSchema = mongoose.Schema(
	{
		user: {
			id: {
				type: String,
				default: ''
			}
		},
		date: {
			type: String,
			default: ''
		},
		amount: {
			type: String,
			default: ''
		},
		deduction: {
			type: Number,
			default: 0
		},
		attendance: {
			type: Array,
			default: []
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

const Payroll = mongoose.models.Payroll || mongoose.model('Payroll', PayrollSchema)

export default Payroll
