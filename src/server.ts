import 'reflect-metadata'

import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { Arg, buildSchema, Field, FieldResolver, ID, ObjectType, Query, Resolver, Root } from 'type-graphql'

import * as dataset from './data'

const app = express()

@ObjectType()
class Person {
	@Field(type => ID)
	id: number

	@Field()
	name: string

	@Field(type => [Hobby])
	hobbies: number[]
}

@ObjectType()
class Hobby {
	@Field(type => ID)
	id: number

	@Field()
	name: string
}

@Resolver(Person)
class PersonResolver {
	@Query(returns => Person)
	async person(@Arg('id') id: number) {
		return dataset.people.find(p => p.id === id)
	}

	@Query(returns => [Person])
	async people() {
		return dataset.people
	}

	@FieldResolver()
	async hobbies(@Root() person: Person) {
		return person.hobbies.map(hId => dataset.hobbies.find(hobby => hobby.id === hId))
	}
}

@Resolver(Hobby)
class HobbyResolver {
	@Query(returns => Hobby)
	async hobby(@Arg('id') id: number) {
		return dataset.hobbies.find(h => h.id === id)
	}

	@Query(returns => [Hobby])
	async hobbies() {
		return dataset.hobbies
	}
}

const init = async () => {

	const schema = await buildSchema({
		resolvers: [PersonResolver, HobbyResolver]
	})

	app.use('/graphql', graphqlHTTP({
		graphiql: true,
		schema
	}))

	app.listen(3000, () => console.log(`Server running...`))
}

init()
