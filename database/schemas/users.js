import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			required: true
		},
		image: {
			type: String,
			default: ''
		},
		contact: {
			type: String,
			default: ''
		},
		address: {
			type: String,
			default: ''
		},
		position: {
			name: {
				type: String,
				default: ''
			},
			rate: {
				type: Number,
				default: 0
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
		activities: {
			id: {
				type: String,
				default: ''
			},
			started: {
				type: String,
				default: ''
			}
		},
		balance: {
			type: String,
			default: '0'
		},
		role: {
			type: String,
			default: 'User'
		},
		status: {
			type: String,
			default: 'Active'
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

const Users = mongoose.models.Users || mongoose.model('Users', UserSchema)

export default Users
