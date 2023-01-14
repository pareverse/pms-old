import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Button, chakra, Container, Flex, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'

const AppLayout = (props) => {
	const router = useRouter()
	const { data: session, status } = useSession()
	const isAdmin = session ? (session.user.role === 'Admin' ? true : false) : false
	const isEmployee = session ? (session.user.role === 'Employee' ? true : false) : false
	const isUser = session ? (session.user.role === 'User' ? true : false) : false
	const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure()

	if (status === 'loading') {
		return (
			<Flex justify="center" align="center" h="100vh" w="full">
				<Spinner size="xl" thickness={2} speed="0.8s" emptyColor="canvas-1" color="brand.default" />
			</Flex>
		)
	} else {
		if (!session && !router.pathname.includes('login')) {
			router.push('/login')
			return null
		}

		if (!session && router.pathname.includes('login')) {
			return props.children
		}

		if ((session && session.user.role === 'User') || (session && session.user.status === 'Inactive')) {
			return (
				<>
					<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />

					<Container maxW={1280}>
						<Flex bg="red.alpha" justify="space-between" align="center" border="1px" borderColor="red.default" p={6}>
							<Flex direction="column">
								<Text fontSize={24} fontWeight="semibold" color="red.default">
									You are not authorized to view this page.
								</Text>

								<Text fontSize="sm" color="red.default">
									You do not have permission to view this directory or page using the credentials that you supplied.
								</Text>
							</Flex>

							<Button variant="outline" size="xl" colorScheme="red">
								Message Us
							</Button>
						</Flex>
					</Container>
				</>
			)
		}

		if (isEmployee && router.pathname !== '/') {
			router.push('/')
			return null
		}

		if (isAdmin && !router.pathname.includes('admin')) {
			router.push('/admin/attendance')
			return null
		}

		return (
			<>
				<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />

				<chakra.div mx="auto" w="full" maxW={isAdmin ? 1536 : 1280}>
					{isAdmin && <Sidebar isSidebarOpen={isSidebarOpen} onSidebarClose={onSidebarClose} />}

					<chakra.main ml={{ base: 0, lg: isAdmin ? 256 : 0 }} w={{ base: 'full', lg: isAdmin ? 'calc(100% - 256px)' : 'full' }}>
						{props.children}
					</chakra.main>
				</chakra.div>
			</>
		)
	}
}

export default AppLayout
