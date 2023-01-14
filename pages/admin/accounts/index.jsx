import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, chakra, Container, Divider, Flex, IconButton, Select, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const Accounts = () => {
	const router = useRouter()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))

	return (
		<Container>
			<Card>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center">
						<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
							Accounts
						</Text>
					</Flex>

					<Divider />

					<Table
						data={users}
						fetched={isUsersFetched}
						th={['Full Name', 'Email Address', 'Position', 'Role', 'Status', '']}
						td={(user) => (
							<Tr key={user._id}>
								<Td>
									<Flex align="center" gap={3}>
										<Avatar name={user.name} src={user.image} />

										<Text textTransform="capitalize">{user.name}</Text>
									</Flex>
								</Td>

								<Td textAlign="center">
									<Text>{user.email}</Text>
								</Td>

								<Td textAlign="center">
									<Text textTransform="capitalize">{user.position.name ? user.position.name : '-'}</Text>
								</Td>

								<Td textAlign="center">
									<Badge variant="tinted" colorScheme={user.role === 'Admin' ? 'yellow' : user.role === 'Employee' ? 'blue' : user.role === 'User' && 'red'}>
										{user.role}
									</Badge>
								</Td>

								<Td textAlign="center">
									<Badge variant="tinted" colorScheme={user.status === 'Active' ? 'blue' : 'red'}>
										{user.status}
									</Badge>
								</Td>

								<Td textAlign="right">
									<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={() => router.push(`/admin/accounts/${user._id}`)} />
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" gap={3}>
								<Select placeholder="Role" size="lg" w="auto" {...register('role')}>
									<chakra.option value="Admin">Admin</chakra.option>
									<chakra.option value="Employee">Employee</chakra.option>
									<chakra.option value="User">User</chakra.option>
								</Select>

								<Select placeholder="Status" size="lg" w="auto" {...register('status')}>
									<chakra.option value="Active">Active</chakra.option>
									<chakra.option value="Inactive">Inactive</chakra.option>
								</Select>
							</Flex>
						)}
						filters={(data, watch) => {
							return data
								.filter((data) =>
									['name', 'email'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
								.filter((data) => (watch('role') ? watch('role') === data.role : data))
								.filter((data) => (watch('status') ? watch('status') === data.status : data))
						}}
						effects={(watch) => [watch('role'), watch('status')]}
					/>
				</Flex>
			</Card>
		</Container>
	)
}

export default Accounts
