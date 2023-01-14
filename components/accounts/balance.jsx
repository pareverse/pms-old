import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Badge, Button, chakra, Divider, Flex, Icon, keyframes, Td, Text, Tr, useDisclosure, usePrefersReducedMotion, useToast } from '@chakra-ui/react'
import { FiCreditCard, FiRefreshCw } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Table from 'components/_table'
import Toast from 'components/_toast'
import { months } from 'functions/months'

const PayModal = ({ user, refresh }) => {
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const queryClient = useQueryClient()
	const { data: attendance, isFetched: isAttendanceFetched } = useQuery(['attendance_unpayed'], () => api.all('/attendance'))
	const { data: deducs, isFetched: isDeducsFetched } = useQuery(['deducs'], () => api.all('/deductions'))

	const deduction = (data) => {
		let sum = 0

		data.forEach((data) => {
			sum += data.amount
		})

		return sum
	}

	const addMutation = useMutation((data) => api.create('/payroll', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('payroll')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Payroll added successfully." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		addMutation.mutate({
			user: {
				id: user._id
			},
			date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }).split(',')[0].trim(),
			amount: user.balance,
			deduction: deduction(deducs),
			attendance: attendance.filter((x) => !x.status)
		})
	}

	return (
		<Modal
			title="Pay"
			size="2xl"
			toggle={(onOpen) => (
				<Button variant="tinted" size="lg" colorScheme="brand" disabled={user.activities.started || refresh} onClick={onOpen}>
					Pay Now
				</Button>
			)}
			disclosure={disclosure}
		>
			<Flex direction="column" gap={6}>
				<Flex justify="center">
					<Text fontSize={32} fontWeight="semibold" color="accent-1">
						₱{Number(user.balance.split('.')[0]).toLocaleString(undefined, { maximumFractionDigits: 2 })}.{Number(user.balance).toFixed(2).split('.')[1]}
					</Text>
				</Flex>

				<Divider />

				<Table
					data={attendance}
					fetched={isAttendanceFetched}
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

				<Divider />

				<Flex justify="end" align="center" gap={3}>
					<Button size="lg" onClick={disclosure.onClose}>
						Close
					</Button>

					<Button size="lg" colorScheme="brand" isLoading={isLoading} onClick={onSubmit}>
						Pay Now
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const spin = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
`

const Balance = ({ user }) => {
	const { data: session } = useSession()
	const [refresh, setRefresh] = useState(false)
	const motion = usePrefersReducedMotion()
	const animation = motion ? undefined : `${spin} 1s linear infinite`

	useEffect(() => {
		const timer = setTimeout(() => {
			setRefresh(false)
		}, 1000)

		return () => {
			clearTimeout(timer)
		}
	}, [refresh])

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={3}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiCreditCard} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Balance
						</Text>
					</Flex>

					<chakra.button onClick={() => setRefresh(true)}>
						<Icon as={FiRefreshCw} animation={refresh ? animation : null} size={4} color="brand.default" />
					</chakra.button>
				</Flex>

				<Flex justify="space-between" align="center" gap={6}>
					{refresh ? (
						<Text fontSize={32} fontWeight="semibold" color="accent-1">
							₱{(0).toFixed(2)}
						</Text>
					) : (
						<Text fontSize={32} fontWeight="semibold" color="accent-1">
							₱{Number(user.balance.split('.')[0]).toLocaleString(undefined, { maximumFractionDigits: 2 })}.{Number(user.balance).toFixed(2).split('.')[1]}
						</Text>
					)}

					{session.user.role === 'Admin' && <PayModal user={user} refresh={refresh} />}
				</Flex>
			</Flex>
		</Card>
	)
}

export default Balance
