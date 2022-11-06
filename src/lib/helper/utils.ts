// Regex to validate a klass
// 20HTXCR : Pass
// 2HTXCR : Fail
// 20CR : Fail
const classRegex = /\d\d(HTX|STX)\w{1,4}/;
// Regex for the teacher option
const teacherRegex = /LÆRER/;
// This is a regex for legacy classes, it only accepts classes before 2020
const legacyRegex = /1\dXA\w/;

// Just a helper function to check all three regex's at the same time
// Also export this because we use it in ./profile.ts
export const isValidClass = (inp: string) => (classRegex.test(inp) || legacyRegex.test(inp) || teacherRegex.test(inp));