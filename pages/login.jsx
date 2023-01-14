import { signIn } from 'next-auth/react'
import { Button, chakra, Divider, Flex, Text } from '@chakra-ui/react'
import Logo from 'components/_logos'

const Google = () => {
	return (
		<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_2_225)">
				<path d="M19.805 10.2303C19.805 9.55056 19.7499 8.86711 19.6323 8.19836H10.2V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.825C18.7173 15.8449 19.805 13.2728 19.805 10.2303Z" fill="#4285F4" />
				<path d="M10.2 20.0006C12.897 20.0006 15.1715 19.1151 16.8287 17.5865L13.6062 15.0879C12.7096 15.6979 11.5522 16.0433 10.2037 16.0433C7.5948 16.0433 5.38279 14.2832 4.58911 11.9169H1.26373V14.4927C2.96133 17.8695 6.41898 20.0006 10.2 20.0006Z" fill="#34A853" />
				<path d="M4.58546 11.9169C4.16657 10.6749 4.16657 9.33008 4.58546 8.08811V5.51233H1.26376C-0.154572 8.33798 -0.154572 11.667 1.26376 14.4927L4.58546 11.9169Z" fill="#FBBC04" />
				<path d="M10.2 3.95805C11.6257 3.936 13.0036 4.47247 14.0361 5.45722L16.8911 2.60218C15.0833 0.904587 12.6839 -0.0287217 10.2 0.000673888C6.41898 0.000673888 2.96133 2.13185 1.26373 5.51234L4.58543 8.08813C5.37544 5.71811 7.59113 3.95805 10.2 3.95805Z" fill="#EA4335" />
			</g>

			<defs>
				<clipPath id="clip0_2_225">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	)
}

const Login = () => {
	return (
		<Flex justify="center" align="center" h="full" minH="100vh">
			<Flex direction="column" align="center" gap={6} border="1px solid" borderColor="border" borderRadius={12} p={6} w="full" maxW={360}>
				<Logo size={24} />

				<Flex direction="column" align="center" gap={3} w="full" textAlign="center">
					<Text fontSize="2xl" fontWeight="bold" color="accent-1">
						Samgyup Salamat <chakra.span color="brand.default">Pay</chakra.span>
					</Text>

					<Text fontSize="sm">
						Cloud-based Payroll System,
						<br /> access your data anytime.
					</Text>
				</Flex>

				<Divider />

				<Flex direction="column" gap={3} w="full">
					<Button
						size="lg"
						colorScheme="brand"
						leftIcon={
							<Flex bg="white" justify="center" align="center" borderRadius="full" h={6} w={6}>
								<Google />
							</Flex>
						}
						onClick={() => signIn('google')}
					>
						Continue with Google
					</Button>

					<Button size="lg">Make contact with us</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Login
