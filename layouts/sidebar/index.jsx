import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { chakra, Flex, Grid, GridItem, Icon, Link, Text } from '@chakra-ui/react'
import { FiBriefcase, FiCheckCircle, FiClock, FiFileMinus, FiFileText, FiUsers } from 'react-icons/fi'

const Sidebar = ({ isSidebarOpen, onSidebarClose }) => {
	const router = useRouter()

	return (
		<>
			<chakra.div bg="hsla(0, 0%, 0%, 0.4)" display={{ base: 'block', lg: 'none' }} position="fixed" top={0} left={0} h="100vh" w="full" visibility={isSidebarOpen ? 'visible' : 'hidden'} opacity={isSidebarOpen ? 1 : 0} transition="0.4s ease-in-out" zIndex={99} onClick={onSidebarClose} />

			<chakra.aside bg="system" position="fixed" top={{ base: 0, lg: 'auto' }} left={{ base: isSidebarOpen ? 0 : -256, lg: 'auto' }} h="100vh" w={256} transition="0.4s ease-in-out" zIndex={100}>
				<Grid templateRows="1fr" h="full">
					<GridItem p={6}>
						{/* <NextLink href="/admin/dashboard" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('dashboard') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiPieChart} boxSize={4} />

									<Text>Dashboard</Text>
								</Flex>
							</Link>
						</NextLink> */}

						<NextLink href="/admin/attendance" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('attendance') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiCheckCircle} boxSize={4} />

									<Text>Attendance</Text>
								</Flex>
							</Link>
						</NextLink>

						<NextLink href="/admin/positions" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('positions') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiBriefcase} boxSize={4} />

									<Text>Positions</Text>
								</Flex>
							</Link>
						</NextLink>

						<NextLink href="/admin/workhours" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('workhours') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiClock} boxSize={4} />

									<Text>Work Hours</Text>
								</Flex>
							</Link>
						</NextLink>

						<NextLink href="/admin/deductions" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('deductions') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiFileMinus} boxSize={4} />

									<Text>Deductions</Text>
								</Flex>
							</Link>
						</NextLink>

						<NextLink href="/admin/payroll" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('payroll') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiFileText} boxSize={4} />

									<Text>Payroll</Text>
								</Flex>
							</Link>
						</NextLink>

						<NextLink href="/admin/accounts" passHref>
							<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('accounts') ? 1 : 0} onClick={onSidebarClose}>
								<Flex align="center" gap={3}>
									<Icon as={FiUsers} boxSize={4} />

									<Text>Accounts</Text>
								</Flex>
							</Link>
						</NextLink>
					</GridItem>
				</Grid>
			</chakra.aside>
		</>
	)
}

export default Sidebar
