import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Grid, GridItem, Spinner } from '@chakra-ui/react'
import Profile from 'components/accounts/profile'
import Role from 'components/accounts/role'
import Status from 'components/accounts/status'
import Balance from 'components/accounts/balance'
import Duration from 'components/accounts/duration'
import Attendance from 'components/accounts/attendance'
import Payroll from 'components/accounts/payroll'

const Home = () => {
	const { data: session } = useSession()
	const { data: user, isFetched: isUserFetched } = useQuery(['user'], () => api.get('/users', session.user.id), { enabled: session ? true : false })

	if (!session) {
		return null
	}

	if (session && !isUserFetched) {
		return (
			<Container>
				<Spinner color="brand.default" />
			</Container>
		)
	}

	return (
		<Container>
			<Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} alignItems="start" gap={6}>
				<GridItem display="grid" gap={6}>
					<Profile user={user} />
					<Role user={user} />
					<Status user={user} />
				</GridItem>

				<GridItem display="grid" gap={6}>
					<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
						<GridItem>
							<Balance user={user} />
						</GridItem>

						<GridItem>
							<Duration user={user} />
						</GridItem>
					</Grid>

					<Attendance user={user} />
					<Payroll user={user} />
				</GridItem>
			</Grid>
		</Container>
	)
}

export default Home
