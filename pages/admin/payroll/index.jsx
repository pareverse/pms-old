import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, chakra, Container, Divider, Flex, IconButton, Td, Text, Tr, useDisclosure } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import { months } from 'functions/months'

const ViewModal = ({ payroll }) => {
	const disclosure = useDisclosure()

	return (
		<Modal title="Pay" size="2xl" toggle={(onOpen) => <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={onOpen} />} disclosure={disclosure}>
			<Flex direction="column" gap={6}>
				<Flex justify="center">
					<Text fontSize={32} fontWeight="semibold" color="accent-1">
						₱{payroll.amount - payroll.deduction}
					</Text>
				</Flex>

				<Divider />

				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="sm" color="accent-1">
						Amount
					</Text>

					<Text fontSize="sm" color="accent-1">
						₱{payroll.amount}
					</Text>
				</Flex>

				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="sm" color="accent-1">
						Deduction
					</Text>

					<Text fontSize="sm" color="accent-1">
						₱{payroll.deduction}
					</Text>
				</Flex>

				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="sm" color="accent-1">
						Total
					</Text>

					<Text fontSize="sm" color="accent-1">
						₱{payroll.amount - payroll.deduction}
					</Text>
				</Flex>

				<Divider />

				<Table
					data={payroll.attendance}
					fetched={true}
					th={['Date', 'Time In', 'Time Out', 'Earned']}
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
											<chakra.span bg="brand.default" borderRadius="full" h={3} w={3} />
											<Text>{Number(attendance.timein.split(',')[1].trim().split(':')[0]) <= 9 ? '0' + attendance.timein.split(',')[1].trim() : attendance.timein.split(',')[1].trim()}</Text>
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
											<chakra.span bg="brand.default" borderRadius="full" h={3} w={3} />
											<Text>{Number(attendance.timeout.split(',')[1].trim().split(':')[0]) <= 9 ? '0' + attendance.timeout.split(',')[1].trim() : attendance.timeout.split(',')[1].trim()}</Text>
										</>
									) : (
										'-'
									)}
								</Flex>
							</Td>

							<Td textAlign="center">
								<Text>₱{Number(attendance.earned).toFixed(2).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
							</Td>
						</Tr>
					)}
					filters={(data) => {
						return data.filter((data) => !data.status)
					}}
					settings={{
						controls: 'off',
						search: 'off',
						show: [99]
					}}
				/>
			</Flex>
		</Modal>
	)
}

const Payroll = () => {
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: payroll, isFetched: isPayrollFetched } = useQuery(['payroll'], () => api.all('/payroll'))

	return (
		<Container>
			<Card>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center">
						<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
							Payroll
						</Text>

						<Button size="lg" colorScheme="brand">
							Add New
						</Button>
					</Flex>

					<Divider />

					<Table
						data={payroll}
						fetched={isUsersFetched && isPayrollFetched}
						th={['Employee', 'ID', 'Date', 'Attendance', 'Amount', '']}
						td={(payroll) => (
							<Tr key={payroll._id}>
								<Td>
									{users
										.filter((user) => user._id === payroll.user.id)
										.map((user) => (
											<Flex align="center" gap={3} key={user._id}>
												<Avatar name={user.name} src={user.image} />
												<Text>{user.name}</Text>
											</Flex>
										))}
								</Td>

								<Td textAlign="center">
									<Badge variant="tinted" colorScheme="brand">
										{payroll._id.slice(10, 20)}
									</Badge>
								</Td>

								<Td textAlign="center">
									<Text>{months[payroll.date.split('/')[0] - 1] + ' ' + payroll.date.split('/')[1] + ', ' + payroll.date.split('/')[2]}</Text>
								</Td>

								<Td textAlign="center">
									<Text>{payroll.attendance.length}</Text>
								</Td>

								<Td textAlign="center">
									<Text>₱{Number(payroll.amount).toFixed(2)}</Text>
								</Td>

								<Td textAlign="right">
									<ViewModal payroll={payroll} />
								</Td>
							</Tr>
						)}
					/>
				</Flex>
			</Card>
		</Container>
	)
}

export default Payroll
