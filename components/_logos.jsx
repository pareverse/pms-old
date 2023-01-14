import { Flex, Icon } from '@chakra-ui/react'
import { FiFeather } from 'react-icons/fi'

const Logo = (props) => {
	return (
		<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={props.size ? props.size : 8} w={props.size ? props.size : 8} {...props}>
			<Icon as={props.icon ? props.icon : FiFeather} boxSize={props.size ? props.size / 2 : 4} color="white" />
		</Flex>
	)
}

export default Logo
