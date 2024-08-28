import { faker } from '@faker-js/faker'

export const pluck = <T>(arr: T[], key: keyof T) => arr.map(i => i[key])

export function randomElement<T>(items: T[], ratio: true): T;
export function randomElement<T>(items: T[], ratio?: number | { min: number; max: number; }): T[];
export function randomElement<T>(items: T[], ratio: number | { min: number; max: number; } | true = 0.5): T | T[] {
  return ratio === true
    ? faker.helpers.arrayElement<T>(items)
    : typeof ratio === 'object'
      ? faker.helpers.arrayElements<T>(items, ratio)
      : faker.helpers.arrayElements<T>(items, Math.floor(items.length * ratio))
}