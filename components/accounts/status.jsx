import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { chakra, Flex, Icon, Input, Select, Text, useToast } from '@chakra-ui/react'
import { FiToggleRight } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'

const Status = ({ user }) => {
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
		setValue('status', user.status)
	}, [])

	useEffect(() => {
		if (watch('status') !== user.status) {
			editMutation.mutate({
				status: watch('status')
			})
		}
	}, [watch('status')])

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiToggleRight} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Status
						</Text>
					</Flex>

					<chakra.span bg={watch('status') === 'Active' ? 'blue.default' : watch('status') === 'Inactive' && 'red.default'} borderRadius="full" h={5} w={5} />
				</Flex>

				{session.user.role === 'Admin' ? (
					<Select size="lg" {...register('status')}>
						<chakra.option value="Active">Active</chakra.option>
						<chakra.option value="Inactive">Inactive</chakra.option>
					</Select>
				) : (
					<Input value={user.status} size="lg" cursor="default" readOnly />
				)}
			</Flex>
		</Card>
	)
}

export default Status
