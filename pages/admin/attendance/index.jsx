import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, chakra, Container, Divider, Flex, Icon, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiCheckCircle, FiMoreHorizontal, FiXCircle } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { months } from 'functions/months'
import { timeinStatus, timeoutStatus } from 'functions/status'

const Attendance = () => {
	const router = useRouter()

	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: attendance, isFetched: isAttendanceFetched } = useQuery(['attendance'], () => api.all('/attendance'))

	return (
		<Container>
			<Card>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center">
						<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
							Attendance
						</Text>
					</Flex>

					<Divider />

					<Table
						data={attendance}
						fetched={isAttendanceFetched}
						th={['Employee', 'Date', 'Time In', 'Time Out', 'Earned', 'Payed', '']}
						td={(attendance) => (
							<Tr key={attendance._id}>
								<Td>
									{isUsersFetched &&
										users
											.filter((user) => user._id === attendance.user.id)
											.map((user) => (
												<Flex align="center" gap={3} key={user._id}>
													<Avatar name={user.name} src={user.image} />
													<Text>{user.name}</Text>
												</Flex>
											))}
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme="brand">
										{months[attendance.date.split('/')[0] - 1] + ' ' + attendance.date.split('/')[1] + ', ' + attendance.date.split('/')[2]}
									</Badge>
								</Td>

								<Td>
									<Flex justify="center" align="center" gap={2}>
										{attendance.timein ? (
											<>
												<Badge variant="tinted" textTransform="capitalize" colorScheme={timeinStatus(attendance.workhours.timein, attendance.timein.split(',')[1].trim()) === 'ontime' ? 'brand' : 'red'}>
													{timeinStatus(attendance.workhours.timein, attendance.timein.split(',')[1].trim())}
												</Badge>

												<Text>{attendance.timein.split(',')[1].trim()}</Text>
											</>
										) : (
											'-'
										)}
									</Flex>
								</Td>

								<Td textAlign="center">
									<Flex justify="center" align="center" gap={2}>
										{attendance.timeout ? (
											<>
												<Badge variant="tinted" colorScheme={timeoutStatus(attendance.workhours.timeout, attendance.timeout.split(',')[1].trim()) === 'ontime' ? 'brand' : 'blue'}>
													{timeoutStatus(attendance.workhours.timeout, attendance.timeout.split(',')[1].trim())}
												</Badge>

												<Text>{attendance.timeout.split(',')[1].trim()}</Text>
											</>
										) : (
											'-'
										)}
									</Flex>
								</Td>

								<Td textAlign="center">
									<Text>₱{Number(attendance.earned).toFixed(2).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
								</Td>

								<Td textAlign="center">{attendance.status ? <Icon as={FiCheckCircle} boxSize={4} color="brand.default" /> : <Icon as={FiXCircle} boxSize={4} color="red.default" />}</Td>

								<Td textAlign="right">
									<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={() => router.push(`/admin/accounts/${attendance.user.id}`)} />
								</Td>
							</Tr>
						)}
						settings={{
							search: 'off'
						}}
					/>
				</Flex>
			</Card>
		</Container>
	)
}

export default Attendance
