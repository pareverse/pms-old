import { useRouter } from 'next/router'
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
	const router = useRouter()
	const { id } = router.query

	const { data: user, isFetched: isUserFetched } = useQuery(['user', id], () => api.get('/users', id))
	const { data: positions, isFetched: isPositionsFetched } = useQuery(['positions'], () => api.all('/positions'))
	const { data: workhours, isFetched: isWorkhoursFetched } = useQuery(['workhours'], () => api.all('/workhours'))

	if (!isUserFetched || !isPositionsFetched || !isWorkhoursFetched) {
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
					<Profile user={user} positions={positions} workhours={workhours} />
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
