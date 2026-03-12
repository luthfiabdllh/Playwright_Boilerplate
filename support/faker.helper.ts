import { faker } from '@faker-js/faker';

/**
 * Faker.js utility helper for generating dynamic fake data.
 * Use this in step definitions to create test data on the fly.
 */
export const FakerHelper = {
  /**
   * Generate a random user object
   */
  user: () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12, memorable: true }),
    phone: faker.phone.number(),
  }),

  /**
   * Generate a random valid email address
   */
  email: () => faker.internet.email(),

  /**
   * Generate a random strong password
   */
  password: (length = 12) =>
    faker.internet.password({ length, memorable: false }),

  /**
   * Generate a random full name
   */
  fullName: () => faker.person.fullName(),

  /**
   * Generate a random phone number
   */
  phone: () => faker.phone.number(),

  /**
   * Generate a random word (useful for search/input testing)
   */
  word: () => faker.lorem.word(),

  /**
   * Generate a random sentence
   */
  sentence: () => faker.lorem.sentence(),

  /**
   * Generate a random date within a given range
   */
  date: (options?: { from?: Date; to?: Date }) =>
    faker.date.between({
      from: options?.from ?? new Date('2020-01-01'),
      to: options?.to ?? new Date(),
    }),

  /**
   * Generate a random UUID
   */
  uuid: () => faker.string.uuid(),

  /**
   * Generate a random integer
   */
  number: (min = 1, max = 999) => faker.number.int({ min, max }),
};
