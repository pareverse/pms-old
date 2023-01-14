import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Button, chakra, Flex, Icon, keyframes, Text, usePrefersReducedMotion, useToast } from '@chakra-ui/react'
import { FiClock, FiRefreshCw } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'
import { results } from 'functions/date'

const spin = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
`

const Duration = ({ user }) => {
	const router = useRouter()
	const { data: session } = useSession()

	const [started, setStarted] = useState(user.activities.id ? user.activities.started : null)
	const [current, setCurrent] = useState(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
	const [refresh, setRefresh] = useState(false)

	const [hours, setHours] = useState(started ? results(started, current).hours : 0)
	const [minutes, setMinutes] = useState(started ? results(started, current).minutes : 0)
	const [seconds, setSeconds] = useState(started ? results(started, current).seconds : 0)

	const motion = usePrefersReducedMotion()
	const animation = motion ? undefined : `${spin} 1s linear infinite`
	const toast = useToast()

	const queryClient = useQueryClient()
	const { data: attendance, isFetched: isAttendanceFetched } = useQuery(['attendance'], () => api.all('/attendance'))

	const isAttended = (attendance) => {
		let date = false
		let now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
		let date_trim = now.split(',')[0].trim()

		isAttendanceFetched &&
			attendance.map((a) => {
				if (a.date === date_trim) {
					date = true
				} else {
					date = false
				}
			})

		return date
	}

	const startMutation = useMutation((data) => api.create('/attendance/timein', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('attendance')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Attendance started successfully." />
			})

			setRefresh(true)
		}
	})

	const stopMutation = useMutation((data) => api.create('/attendance/timeout', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('attendance')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Attendance stopped successfully." />
			})
		}
	})

	const onStart = () => {
		const started = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })

		startMutation.mutate({
			user: {
				id: user._id
			},
			workhours: {
				timein: user.workhours.timein,
				timeout: user.workhours.timeout
			},
			date: started.split(',')[0].trim(),
			timein: started
		})

		setStarted(started)
	}

	const onStop = () => {
		setStarted(null)
		setCurrent(null)
		setHours(0)
		setMinutes(0)
		setSeconds(0)

		stopMutation.mutate({
			user: {
				id: user._id
			},
			timeout: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
			earned: (user.position.rate * hours + (user.position.rate / 60) * minutes + (user.position.rate / 60 / 60) * seconds).toFixed(2)
		})
	}

	useEffect(() => {
		if (started && !refresh) {
			const timer = setTimeout(() => {
				setCurrent(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))

				if (seconds === 59) {
					setSeconds(0)

					if (minutes === 59) {
						setMinutes(0)
						setHours((prev) => prev + 1)
					} else {
						setMinutes((prev) => prev + 1)
					}
				} else {
					setSeconds((prev) => prev + 1)
				}
			}, 1000)

			return () => {
				clearTimeout(timer)
			}
		} else {
			setCurrent(null)
		}
	}, [started, seconds])

	useEffect(() => {
		if (started && refresh) {
			const timer = setTimeout(() => {
				router.reload()
			}, 1000)

			return () => {
				clearTimeout(timer)
			}
		} else {
			const timer = setTimeout(() => {
				setRefresh(false)
			}, 1000)

			return () => {
				clearTimeout(timer)
			}
		}
	}, [refresh])

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Flex align="center" gap={3}>
						<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={8} w={8}>
							<Icon as={FiClock} boxSize={4} color="brand.default" />
						</Flex>

						<Text fontSize="xl" fontWeight="medium" color="accent-1">
							Duration
						</Text>
					</Flex>

					<chakra.button onClick={() => setRefresh(true)}>
						<Icon as={FiRefreshCw} animation={refresh ? animation : null} size={4} color="brand.default" />
					</chakra.button>
				</Flex>

				<Flex justify="space-between" align="center" gap={6}>
					{refresh ? (
						<Text fontSize={32} fontWeight="semibold" color="accent-1">
							00:00:00
						</Text>
					) : (
						<Text fontSize={32} fontWeight="semibold" color="accent-1">
							{hours <= 9 ? '0' + hours : hours}:{minutes <= 9 ? '0' + minutes : minutes}:{seconds <= 9 ? '0' + seconds : seconds}
						</Text>
					)}

					{started ? (
						<Button variant="tinted" size="lg" colorScheme="red" disabled={refresh} onClick={onStop}>
							Time Out
						</Button>
					) : session.user.role === 'Admin' ? (
						<Button variant="tinted" size="lg" colorScheme="brand" disabled={refresh} onClick={onStart}>
							Time In
						</Button>
					) : (
						<Button variant="tinted" size="lg" colorScheme="brand" disabled={!isAttendanceFetched || isAttended(attendance) || refresh} onClick={onStart}>
							Time In
						</Button>
					)}
				</Flex>
			</Flex>
		</Card>
	)
}

export default Duration
