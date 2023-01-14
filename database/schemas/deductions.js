import mongoose from 'mongoose'

const DeductionSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		amount: {
			type: Number,
			default: 0
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

const Deductions = mongoose.models.Deductions || mongoose.model('Deductions', DeductionSchema)

export default Deductions
