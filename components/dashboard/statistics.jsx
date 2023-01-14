import { GridItem, SimpleGrid } from '@chakra-ui/react'
import Card from 'components/_card'

const Statistics = () => {
	return (
		<GridItem>
			<SimpleGrid columns={4} gap={6}>
				<Card></Card>
				<Card></Card>
				<Card></Card>
				<Card></Card>
			</SimpleGrid>
		</GridItem>
	)
}

export default Statistics
