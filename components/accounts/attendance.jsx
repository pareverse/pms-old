import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, chakra, Flex, Icon, IconButton, Select, Td, Text, Tr } from '@chakra-ui/react'
import { FiCheckCircle, FiMoreHorizontal, FiXCircle } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { months } from 'functions/months'
import { timeinStatus, timeoutStatus } from 'functions/status'

const Attendance = ({ user }) => {
	const { data: attendance, isFetched: isAttendanceFetched } = useQuery(['attendance'], () => api.all('/attendance'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiCheckCircle} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Attendance
						</Text>
					</Flex>

					<Select size="lg" w="auto">
						<chakra.option></chakra.option>
					</Select>
				</Flex>

				<Table
					data={attendance}
					fetched={isAttendanceFetched}
					th={['Date', 'Time In', 'Time Out', 'Earned', 'Payed']}
					td={(attendance) => (
						<Tr key={attendance._id}>
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
						</Tr>
					)}
					filters={(data) => {
						return data.filter((data) => data.user.id === user._id)
					}}
					settings={{
						search: 'off'
					}}
				/>
			</Flex>
		</Card>
	)
}

export default Attendance
