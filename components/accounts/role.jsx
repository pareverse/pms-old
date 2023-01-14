import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { chakra, Flex, Icon, Input, Select, Text, useToast } from '@chakra-ui/react'
import { FiBriefcase } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'

const Role = ({ user }) => {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { register, watch, setValue } = useForm()
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/users', user._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="User updated successfully." />
			})
		}
	})

	useEffect(() => {
		setValue('role', user.role)
	}, [])

	useEffect(() => {
		if (watch('role') !== user.role) {
			editMutation.mutate({
				role: watch('role')
			})
		}
	}, [watch('role')])

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiBriefcase} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Role
						</Text>
					</Flex>

					<chakra.span bg={watch('role') === 'Admin' ? 'yellow.default' : watch('role') === 'Employee' ? 'blue.default' : watch('role') === 'User' && 'red.default'} borderRadius="full" h={5} w={5} />
				</Flex>

				{session.user.role === 'Admin' ? (
					<Select size="lg" {...register('role')}>
						<chakra.option value="Admin">Admin</chakra.option>
						<chakra.option value="Employee">Employee</chakra.option>
						<chakra.option value="User">User</chakra.option>
					</Select>
				) : (
					<Input value={user.role} size="lg" cursor="default" readOnly />
				)}
			</Flex>
		</Card>
	)
}

export default Role
