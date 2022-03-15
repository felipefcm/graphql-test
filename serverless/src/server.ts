import 'reflect-metadata'

import { Arg, buildSchemaSync, Field, FieldResolver, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'

import * as dataset from './data'
import { ApolloServer } from 'apollo-server-lambda'
import { printSchema } from 'graphql'
import { GraphQLString } from 'graphql'

@ObjectType()
class Person {
	@Field(type => ID)
	id: number

	@Field(type => GraphQLString)
	name: string

	@Field(type => [Hobby])
	hobbies: number[]
}

@ObjectType()
class Hobby {
	@Field(type => ID)
	id: number

	@Field(type => GraphQLString)
	name: string
}

@InputType()
class CreatePersonInput implements Partial<Person> {
	@Field(type => GraphQLString)
	name: string

	@Field(type => [Int])
	hobbies: number[]
}

@Resolver(Person)
class PersonResolver {
	@Query(returns => Person)
	async person(@Arg('id', () => Int) id: number) {
		return dataset.people.find(p => p.id === id)
	}

	@Query(returns => [Person])
	async people() {
		return dataset.people
	}

	@FieldResolver()
	async hobbies(@Root() person: Person) {
		return person.hobbies.map(hId =>
			dataset.hobbies.find(hobby => hobby.id === hId)
		)
	}

	@Mutation(returns => Person)
	async addPerson(@Arg('person', () => CreatePersonInput) input: CreatePersonInput) {
		const newPerson: Person = {
			id: Math.trunc(Math.random() * 1000),
			name: input.name,
			hobbies: input.hobbies,
		}

		dataset.people.push(newPerson)
		return newPerson
	}
}

@Resolver(Hobby)
class HobbyResolver {
	@Query(returns => Hobby)
	async hobby(@Arg('id', () => Int) id: number) {
		return dataset.hobbies.find(h => h.id === id)
	}

	@Query(returns => [Hobby])
	async hobbies() {
		return dataset.hobbies
	}
}

const schema = buildSchemaSync({
	resolvers: [PersonResolver, HobbyResolver]
})

console.log(`SCHEMA`, printSchema(schema))

const server = new ApolloServer({
	schema,
})

export const handler = server.createHandler()
