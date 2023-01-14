import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Button, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Table from 'components/_table'
import Toast from 'components/_toast'

const AddModal = () => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addMutation = useMutation((data) => api.create('/deductions', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('deductions')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Deduction added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addMutation.mutate({
			name: data.name,
			amount: Number(data.amount)
		})
	}

	return (
		<Modal
			title="Add Deduction"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.amount}>
						<FormLabel>Amount</FormLabel>
						<Input type="number" size="lg" {...register('amount', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Divider />

					<Flex direction="column" gap={3}>
						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>

						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const EditModal = ({ deduction }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const editMutation = useMutation((data) => api.update('/deductions', deduction._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('deductions')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Deduction added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editMutation.mutate({
			name: data.name,
			amount: Number(data.amount)
		})
	}

	return (
		<Modal title="Edit Deduction" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiEdit2 size={12} />} onClick={() => clearErrors() || reset() || onOpen()} />} disclosure={disclosure}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input defaultValue={deduction.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.amount}>
						<FormLabel>Amount</FormLabel>
						<Input type="number" defaultValue={deduction.amount} size="lg" {...register('amount', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Divider />

					<Flex direction="column" gap={3}>
						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>

						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Deductions = () => {
	const queryClient = useQueryClient()
	const { data: deductions, isFetched: isDeductionsFetched } = useQuery(['deductions'], () => api.all('/deductions'))
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
	const toast = useToast()

	const deleteMutation = useMutation((data) => api.remove('/deductions', data.id), {
		onSuccess: () => {
			queryClient.invalidateQueries('deductions')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Deduction removed successfully." />
			})
		}
	})

	const onDelete = (id) => {
		deleteMutation.mutate({
			id: id
		})
	}

	return (
		<Container>
			<Card>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center">
						<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
							Deductions
						</Text>

						<AddModal />
					</Flex>

					<Divider />

					<Table
						data={deductions}
						fetched={isDeductionsFetched}
						th={['ID', 'Name', 'Amount', 'Updated', 'Created', '']}
						td={(deduction) => (
							<Tr key={deduction._id}>
								<Td>
									<Text textTransform="uppercase">{deduction._id.slice(0, 10)}</Text>
								</Td>

								<Td textAlign="center">
									<Text textTransform="capitalize">{deduction.name}</Text>
								</Td>

								<Td textAlign="center">
									<Text>₱{deduction.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[deduction.updated.split(',')[0].split('/')[0] - 1]} {deduction.updated.split(',')[0].split('/')[1]}, {deduction.updated.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[deduction.created.split(',')[0].split('/')[0] - 1]} {deduction.created.split(',')[0].split('/')[1]}, {deduction.created.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td>
									<Flex justify="end" gap={3}>
										<EditModal deduction={deduction} />
										<IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiTrash2 size={12} />} onClick={() => onDelete(deduction._id)} />
									</Flex>
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

export default Deductions
