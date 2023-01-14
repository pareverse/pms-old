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
import { format } from 'functions/time'

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

	const addMutation = useMutation((data) => api.create('/workhours', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('workhours')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Work Hours added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addMutation.mutate({
			timein: data.timein,
			timeout: data.timeout
		})
	}

	return (
		<Modal
			title="Add Work Hours"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.timein}>
						<FormLabel>Time In</FormLabel>
						<Input type="time" size="lg" {...register('timein', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.timeout}>
						<FormLabel>Time Out</FormLabel>
						<Input type="time" size="lg" {...register('timeout', { required: true })} />
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

const EditModal = ({ workhour }) => {
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

	const editMutation = useMutation((data) => api.update('/workhours', workhour._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('workhours')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Work Hours added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editMutation.mutate({
			timein: data.timein,
			timeout: data.timeout
		})
	}

	return (
		<Modal title="Edit Work Hours" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiEdit2 size={12} />} onClick={() => clearErrors() || reset() || onOpen()} />} disclosure={disclosure}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.timein}>
						<FormLabel>Time In</FormLabel>
						<Input type="time" defaultValue={workhour.timein} size="lg" {...register('timein', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.timeout}>
						<FormLabel>Time Out</FormLabel>
						<Input type="time" defaultValue={workhour.timeout} size="lg" {...register('timeout', { required: true })} />
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

const WorkHours = () => {
	const queryClient = useQueryClient()
	const { data: workhours, isFetched: isWorkhoursFetched } = useQuery(['workhours'], () => api.all('/workhours'))
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
	const toast = useToast()

	const deleteMutation = useMutation((data) => api.remove('/workhours', data.id), {
		onSuccess: () => {
			queryClient.invalidateQueries('workhours')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Work Hours removed successfully." />
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
							Work Hours
						</Text>

						<AddModal />
					</Flex>

					<Divider />

					<Table
						data={workhours}
						fetched={isWorkhoursFetched}
						th={['ID', 'Time In', 'Time Out', 'Updated', 'Created', '']}
						td={(workhour) => (
							<Tr key={workhour._id}>
								<Td>
									<Text textTransform="uppercase">{workhour._id.slice(0, 10)}</Text>
								</Td>

								<Td textAlign="center">
									<Text textTransform="capitalize">{format(workhour.timein)}</Text>
								</Td>

								<Td textAlign="center">
									<Text textTransform="capitalize">{format(workhour.timeout)}</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[workhour.updated.split(',')[0].split('/')[0] - 1]} {workhour.updated.split(',')[0].split('/')[1]}, {workhour.updated.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td textAlign="center">
									<Text>
										{months[workhour.created.split(',')[0].split('/')[0] - 1]} {workhour.created.split(',')[0].split('/')[1]}, {workhour.created.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td>
									<Flex justify="end" gap={3}>
										<EditModal workhour={workhour} />
										<IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiTrash2 size={12} />} onClick={() => onDelete(workhour._id)} />
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

export default WorkHours
