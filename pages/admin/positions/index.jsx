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

	const addMutation = useMutation((data) => api.create('/positions', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('positions')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Position added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addMutation.mutate({
			name: data.name.toLowerCase(),
			rate: Number(data.rate)
		})
	}

	return (
		<Modal
			title="Add Position"
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

					<FormControl isInvalid={errors.rate}>
						<FormLabel>Rate Per Hour</FormLabel>
						<Input type="number" size="lg" {...register('rate', { required: true })} />
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

const EditModal = ({ position }) => {
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

	const editMutation = useMutation((data) => api.update('/positions', position._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('positions')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Position added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editMutation.mutate({
			name: data.name.toLowerCase(),
			rate: Number(data.rate)
		})
	}

	return (
		<Modal title="Edit Position" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiEdit2 size={12} />} onClick={() => clearErrors() || reset() || onOpen()} />} disclosure={disclosure}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input defaultValue={position.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.rate}>
						<FormLabel>Rate Per Hour</FormLabel>
						<Input type="number" defaultValue={position.rate} size="lg" {...register('rate', { required: true })} />
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

const Positions = () => {
	const queryClient = useQueryClient()
	const { data: positions, isFetched: isPositionsFetched } = useQuery(['positions'], () => api.all('/positions'))
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
	const toast = useToast()

	const deleteMutation = useMutation((data) => api.remove('/positions', data.id), {
		onSuccess: () => {
			queryClient.invalidateQueries('positions')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Position removed successfully." />
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
							Positions
						</Text>

						<AddModal />
					</Flex>

					<Divider />

					<Table
						data={positions}
						fetched={isPositionsFetched}
						th={['ID', 'Name', 'Rate Per Hour', 'Updated', 'Created', '']}
						td={(position) => (
							<Tr key={position._id}>
								<Td>
									<Text textTransform="uppercase">{position._id.slice(0, 10)}</Text>
								</Td>

								<Td textAlign="center">
									<Text textTransform="capitalize">{position.name}</Text>
								</Td>

								<Td textAlign="center">
									<Text>₱{position.rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[position.updated.split(',')[0].split('/')[0] - 1]} {position.updated.split(',')[0].split('/')[1]}, {position.updated.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[position.created.split(',')[0].split('/')[0] - 1]} {position.created.split(',')[0].split('/')[1]}, {position.created.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td>
									<Flex justify="end" gap={3}>
										<EditModal position={position} />
										<IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiTrash2 size={12} />} onClick={() => onDelete(position._id)} />
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

export default Positions
