import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, Button, chakra, Divider, Flex, Icon, IconButton, Select, Td, Text, Tr, useDisclosure } from '@chakra-ui/react'
import { FiFileText, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import { months } from 'functions/months'
import { timeinStatus, timeoutStatus } from 'functions/status'

const ViewModal = ({ payroll }) => {
	const disclosure = useDisclosure()

	return (
		<Modal title="Pay" size="3xl" toggle={(onOpen) => <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={onOpen} />} disclosure={disclosure}>
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

				<Flex justify="end">
					<Button size="lg" colorScheme="brand" onClick={() => window.print()}>
						Print
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const Payroll = ({ user }) => {
	const { data: payroll, isFetched: isPayrollFetched } = useQuery(['payroll'], () => api.all('/payroll'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiFileText} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Payroll
						</Text>
					</Flex>

					<Select size="lg" w="auto">
						<chakra.option></chakra.option>
					</Select>
				</Flex>

				<Table
					data={payroll}
					fetched={isPayrollFetched}
					th={['ID', 'Date', 'Attendance', 'Amount', '']}
					td={(payroll) => (
						<Tr key={payroll._id}>
							<Td>
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
					filter={(data) => {
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

export default Payroll
