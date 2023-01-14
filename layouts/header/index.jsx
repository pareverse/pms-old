import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { Avatar, chakra, Flex, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FiFacebook, FiInstagram, FiLogOut, FiMenu, FiMoon, FiSun, FiThumbsUp } from 'react-icons/fi'
import Logo from 'components/_logos'

const Header = ({ session, isAdmin, isEmployee, onSidebarOpen }) => {
	const router = useRouter()
	const { colorMode, toggleColorMode } = useColorMode()
	const colorModeIcon = useColorModeValue(<FiMoon size={16} fill="currentColor" />, <FiSun size={16} fill="currentColor" />)

	return (
		<chakra.header bg="system" position="sticky" top={0} transition=".4s" zIndex={99}>
			<Flex align="center" gap={6} mx="auto" px={6} h={20} w="full" maxW={isAdmin ? 1536 : 1280}>
				<Flex flex={1} justify="start" align="center">
					<Logo display={{ base: 'none', lg: 'flex' }} size={10} />
					<IconButton display={{ base: 'flex', lg: 'none' }} variant="outline" color="accent-1" icon={<FiMenu size={16} />} onClick={onSidebarOpen} />
				</Flex>

				<Flex flex={1} justify="end" align="center">
					<Menu>
						<MenuButton>
							<Avatar boxSize={10} name={session.user.name} src={session.user.image} />
						</MenuButton>

						<MenuList w={256}>
							<MenuItem>
								<Flex align="center" gap={3}>
									<Avatar name={session.user.name} src={session.user.image} />

									<Text color="accent-1" noOfLines={1}>
										{session.user.name}
									</Text>
								</Flex>
							</MenuItem>

							<MenuDivider />

							<MenuItem textTransform="capitalize" icon={colorModeIcon} onClick={toggleColorMode}>
								{colorMode} Mode
							</MenuItem>

							<MenuDivider />

							<MenuItem icon={<FiFacebook size={16} />}>Facebook</MenuItem>
							<MenuItem icon={<FiInstagram size={16} />}>Instagram</MenuItem>
							<MenuItem icon={<FiThumbsUp size={16} />}>Feedback</MenuItem>

							<MenuDivider />

							<MenuItem icon={<FiLogOut size={16} />} onClick={() => signOut()}>
								Sign out
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</Flex>
		</chakra.header>
	)
}

export default Header
