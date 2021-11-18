# Explanation of how the seat system works

## Database

The seats for a LAN is stored as an array of strings (or ranges)

## What is ranges?

This is an example a range `X0..24`
Ranges are string that contain 3 pieces of data.
We can split the range into those pieces
"{Table letter}{Start}..{End}"

- Table letter: This is a symbol to indetify a table
- Start: This is the start of the range, this number is excluded
- End: This is the end of the range, the end is included

## Translation

Let's try to construct all the seats from a range
We will use this range for this example `Y0..6`
Every seat start with the table symbol, and then a number existing the range

- Y1    `We start at 1 because the range start is excluded`
- Y2
- Y3
- Y4
- Y5
- Y6

## Okay but how do i know what seats go where?

This system of ranges is useless without a way to find out where the seats and tables go,
therefore a seating plan must be created alongside.

[Heres an example of a seating plan](https://imgur.com/a/PSqQc56)

In the example the seating ranges would look like this

```js
["A0..24", "B0..24", "C0..24", "D0..24", "E0..6", "F0..6", "D0..6", "H0..24", "I0..24"]
```

## Show me the code

```ts
// This function convert ranges to an object with the table symbols as keys
// And the value as an array of the seat ids
function rangesToTables(ranges: string[]): { [idx: string]: string[] } {
  // Initalize an empty object so that we can stuff things into it later
  const tables: { [idx: string]: string[] } = { };

  // Loop over all the ranges from the input
  ranges.forEach(range => {
    // Destructure the range using a regex
    // This can be done because regex match returns an array of all parts that match the regex
    // If undefined was returned, use a dummy array instead
    const [table, start, end] = range.match(/(^.{1})|\d+/g) || ["?", "0", "1"];

    // Now that we know the start and end, create a new array with the corrent length
    // Then we pass in a mapping function that creates the seat id
    // We do idx + 1 to exclude the start number of the range
    const seats = Array.from({ length: (+end - +start) }, (_, idx) => table + (+start + idx + 1));

    // If we already have seat ids stored in the tables object
    // Then we push the new seats into the array
    // Otherwise we set the key in the object to the seats array
    !!tables[table] ? tables[table].push(...seats) : tables[table] = seats;
  });

  // In the end we return the whole tables array
  return tables;
}
```
