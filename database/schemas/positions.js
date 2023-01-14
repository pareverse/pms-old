import mongoose from 'mongoose'

const PositionSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		rate: {
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

const Positions = mongoose.models.Positions || mongoose.model('Positions', PositionSchema)

export default Positions
