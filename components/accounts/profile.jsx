import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Button, Center, chakra, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Select, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FiChevronRight } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import { format } from 'functions/time'

const EditModal = ({ user, positions, workhours }) => {
	const disclosure = useDisclosure()
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm()

	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/users', user._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="User updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		if (session.user.role === 'Admin') {
			editMutation.mutate({
				name: data.name,
				contact: data.contact,
				address: data.address,
				position: {
					name: data.position.split('-')[0].trim(),
					rate: Number(data.position.split('-')[1].trim())
				},
				workhours: {
					timein: data.workhours.split('-')[0].trim(),
					timeout: data.workhours.split('-')[1].trim()
				}
			})
		} else {
			editMutation.mutate({
				name: data.name,
				contact: data.contact,
				address: data.address
			})
		}
	}

	return (
		<Modal
			title="Edit Profile"
			size="xl"
			toggle={(onOpen) => (
				<Button variant="tinted" size="lg" colorScheme="brand" rightIcon={<FiChevronRight size={16} />} onClick={onOpen}>
					Edit Profile
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl>
						<FormLabel>Identification</FormLabel>
						<Input value={user._id} size="lg" textTransform="uppercase" cursor="not-allowed" readOnly />
					</FormControl>

					<FormControl isInvalid={errors.name}>
						<FormLabel>Full Name</FormLabel>
						<Input defaultValue={user.name} size="lg" textTransform="capitalize" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input value={user.email} size="lg" cursor="not-allowed" readOnly />
					</FormControl>

					<Flex align="start" gap={6}>
						{session.user.role === 'Admin' ? (
							<FormControl isInvalid={errors.position}>
								<FormLabel>Position</FormLabel>

								<Select placeholder="Select" defaultValue={user.position.name + ' - ' + user.position.rate} size="lg" textTransform="capitalize" {...register('position', { required: true })}>
									{positions.map((position) => (
										<chakra.option textTransform="capitalize" value={position.name + ' - ' + position.rate} key={position._id}>
											{position.name}
										</chakra.option>
									))}
								</Select>

								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>
						) : (
							<FormControl>
								<FormLabel>Position</FormLabel>
								<Input value={user.position.name} size="lg" textTransform="capitalize" cursor="default" readOnly />
							</FormControl>
						)}
						<FormControl>
							<FormLabel>Rate Per Hour</FormLabel>

							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input value={Number(user.position.rate).toFixed(2)} size="lg" cursor="not-allowed" readOnly />
							</InputGroup>
						</FormControl>
					</Flex>

					<Flex align="start" gap={6}>
						{session.user.role === 'Admin' ? (
							<FormControl isInvalid={errors.workhours}>
								<FormLabel>Work Hours</FormLabel>

								<Select placeholder="Select" defaultValue={user.workhours.timein + ' - ' + user.workhours.timeout} size="lg" {...register('workhours', { required: true })}>
									{workhours.map((workhour) => (
										<chakra.option value={workhour.timein + ' - ' + workhour.timeout} key={workhour._id}>
											{format(workhour.timein) + ' - ' + format(workhour.timeout)}
										</chakra.option>
									))}
								</Select>

								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>
						) : (
							<FormControl>
								<FormLabel>Work Hours</FormLabel>
								<Input value={format(user.workhours.timein) + ' - ' + format(user.workhours.timeout)} size="lg" textTransform="capitalize" cursor="default" readOnly />
							</FormControl>
						)}

						<FormControl isInvalid={errors.contact}>
							<FormLabel>Contact Number</FormLabel>
							<Input defaultValue={user.contact} size="lg" {...register('contact', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>

					<FormControl isInvalid={errors.address}>
						<FormLabel>Complete Address</FormLabel>
						<Input defaultValue={user.address} size="lg" {...register('address', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>
				</Flex>

				<Flex direction="column" gap={6} mt={6} mx={-6}>
					<Divider />

					<Flex justify="end" align="center" gap={3} px={6}>
						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
							Save Changes
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Profile = ({ user, positions, workhours }) => {
	return (
		<Card>
			<Flex direction="column" align="center" gap={6}>
				<Center>
					<Avatar size="xl" name={user.name} src={user.image} />
				</Center>

				<Flex direction="column" align="center" textAlign="center">
					<Text fontWeight="medium" color="accent-1" noOfLines={1}>
						{user.name}
					</Text>

					<Text fontSize="sm" noOfLines={1}>
						{user.email}
					</Text>
				</Flex>

				<EditModal user={user} positions={positions} workhours={workhours} />
			</Flex>
		</Card>
	)
}

export default Profile
