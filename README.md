# betelgeuse
### boilerplate
  
### Setup instructions 
- copy all .example.env files into new .env files in each respective folder
- cd into dockerfile and run 'docker compose up -d'
- ensure that sirius up and running
- run 'docker exec -it betelgeuse yarn install'
- run 'docker exec -it betelgeuse yarn server refresh' 
- run 'docker exec -it betelgeuse yarn server dev'
- run 'docker exec -it betelgeuse yarn client dev' in a separate shell simultaneously
- now with both server and client running, open browser and navigate to app.betelgeuse
  

### Where clause in repository

The `where` clause is used to filter query results based on specified conditions. It supports logical operations (`and`, `or`) and comparison operations (`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `contains`, `notContains`, `between`, `notBetween`, `in`, `notIn`). 

##### Structure
```typescript
// The `N` is the name of a table in the schema. Eg: 'users' | 'tickets' | ...
const where: WhereClause<N> = {
  and: [], // an array of WhereClause
  or: [], // an array of WhereClause
  column1: { <operator1>: <value> },
  column2: {
    <operator2>: <value>,
    <oeprator3>: <value>,
    ...
  }
  ...
}
```
##### Logical Operations
- and: Combines multiple `WhereClause` conditions with a logical AND.
- or: Combines multiple `WhereClause` conditions with a logical OR.
```typescript
type WhereAnd<N> = { and: WhereClause<N>[] }
type WhereOr<N> = { or: WhereClause<N>[] }
```
##### Comparison Operations
Comparison Operations
- **eq**: Checks if the value is equal to the specified value.
- **ne**: Checks if the value is not equal to the specified value.
- **gt**: Checks if the value is greater than the specified value.
- **gte**: Checks if the value is greater than or equal to the specified value.
- **lt**: Checks if the value is less than the specified value.
- **lte**: Checks if the value is less than or equal to the specified value.
- **contains**: Checks if the value is like the specified value.
- **notContains**: Checks if the value is not like the specified value.
- **in**: Checks if the value is in the specified array of values.
- **notIn**: Checks if the value is not in the specified array of values.
- **between**: Checks if the value is between the two elements of the specified array.
- **notBetween**: Checks if the value is not between the two elements of the specified array.

##### Example Usage
Here are some examples of how to use the `where` clause:
1. **Simple Comparison**
```typescript
const filter = {
  where: {
    columnName: { eq: 'value' }
  }
}
```
2. **Logical AND**
```typescript
const filter = {
  where: {
    and: [
      { columnName1: { eq: 'value1' } },
      { columnName2: { gt: 10 } }
    ]
  }
}
```
3. **Logical OR**
```typescript
const filter = {
  where: {
    or: [
      { columnName1: { lt: 5 } },
      { columnName2: { gte: 20 } }
    ]
  }
}
```
4. **IN Operation**
```typescript
const filter = {
  where: {
    columnName: { in: ['value1', 'value2', 'value3'] }
  }
}
```
5. **Nested Conditions**
```typescript
const filter = {
  where: {
    and: [
      {
        columnName1: { eq: 'value1', ne: null } // IS NOT NULL comparison
      },
      {
        or: [
          { columnName2: { gte: 1, lt: 5 } },
          { columnName3: { gte: 20 } }
        ]
      }
    ]
  }
}
```
1. **Multiple Operators within a Field**
When using multiple operators inside the field object, it'll be treated as `AND` by default if it's in the root object. If it's nested inside an `OR` or an `AND` operator it'll be treated as the parent condition.
###### Example in root clause
```typescript
const filter = {
  where: {
    columnName1: { gt: 5, ne: 7 },
    columnName2: { contains: 'example', notContains: 'test' },
  }
}
```
This will be resolved to `columnName1 > 5 AND columnName1 <> 7 AND columnName2 ILIKE '%example%' AND columnName2 not ILIKE '%test%'`
###### Example in nested clause
```typescript
const filter = {
  where: {
    or: [
      columnName1: { gt: 5, ne: 7 },
      columnName2: { contains: 'example', notContains: 'test' },
    ],
    columnName3: { in: [1,2,3,4,5], lte: 4 }
  }
}
```
This will be resolved to `(columnName1 > 5 OR columnName1 <> 7 OR columnName2 ILIKE '%example%' OR columnName2 not ILIKE '%test%') AND columnName3 in (1,2,3,4,5) and columnName3 <= 4`