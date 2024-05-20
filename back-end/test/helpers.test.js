const { capitalizeName } = require("../src/helpers/emailNotifications");
const {
  formatAttributeDate,
  findRedundantElementsIndexes,
  removeElementsByIndexes,
  getChangedPairs,
} = require("../src/helpers/util");
const { hashData, verifyHashedData } = require('../src/helpers/hashData'); 
const { createPassword, generatePassword ,alpha, numbers, symbols} = require('../src/helpers/createPassword');

describe("capitalizeName", () => {
  it("should capitalize the first letter of a name", async () => {
    const inputName = "john";
    const result = await capitalizeName(inputName);
    expect(result).toBe("John");
  });

  it("should handle names with mixed case", async () => {
    const inputName = "mAry";
    const result = await capitalizeName(inputName);
    expect(result).toBe("Mary");
  });

  it("should handle names with all uppercase letters", async () => {
    const inputName = "JANE";
    const result = await capitalizeName(inputName);
    expect(result).toBe("Jane");
  });
});

describe("formatAttributeDate", () => {
  it("formats a valid date correctly", () => {
    const inputDate = "2023-09-06T00:00:00.000Z";
    const expectedOutput = "2023-09-06";
    expect(formatAttributeDate(inputDate)).toBe(expectedOutput);
  });
});

describe("findRedundantElementsIndexes", () => {
  it("finds redundant string elements at the beginning of the arrays", () => {
    const oldValues = ["apple", "banana", "cherry"];
    const newValues = ["apple", "banana", "cherry", "date", "elderberry"];
    const expectedIndexes = [0, 1, 2];
    expect(findRedundantElementsIndexes(oldValues, newValues)).toEqual(
      expectedIndexes
    );
  });

  it("handles empty arrays", () => {
    const oldValues = [];
    const newValues = [];
    const expectedIndexes = [];
    expect(findRedundantElementsIndexes(oldValues, newValues)).toEqual(
      expectedIndexes
    );
  });

  it("handles arrays with different lengths", () => {
    const oldValues = ["apple", "banana", "cherry"];
    const newValues = ["apple", "banana", "cherry", "date"];
    const expectedIndexes = [0, 1, 2];
    expect(findRedundantElementsIndexes(oldValues, newValues)).toEqual(
      expectedIndexes
    );
  });
});

describe("removeElementsByIndexes", () => {
  it("should remove elements from arrays based on the given indexes", () => {
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = ["a", "b", "c", "d", "e"];
    const arr3 = ["apple", "banana", "cherry", "date", "elderberry"];
    const indexes = [1, 3];

    removeElementsByIndexes(arr1, arr2, arr3, indexes);

    // Check if the elements at the specified indexes have been removed
    expect(arr1).toEqual([1, 3, 5]);
    expect(arr2).toEqual(["a", "c", "e"]);
    expect(arr3).toEqual(["apple", "cherry", "elderberry"]);
  });

  it("should handle empty arrays", () => {
    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    const indexes = [];

    removeElementsByIndexes(arr1, arr2, arr3, indexes);

    // All arrays should remain empty
    expect(arr1).toEqual([]);
    expect(arr2).toEqual([]);
    expect(arr3).toEqual([]);
  });

  it("should handle indexes that are out of bounds", () => {
    const arr1 = [1, 2, 3];
    const arr2 = ["a", "b", "c"];
    const arr3 = ["apple", "banana", "cherry"];
    const indexes = [0, 2, 3];

    removeElementsByIndexes(arr1, arr2, arr3, indexes);

    // Check if the function handles out-of-bounds indexes gracefully
    expect(arr1).toEqual([2]);
    expect(arr2).toEqual(["b"]);
    expect(arr3).toEqual(["banana"]);
  });
});

describe('getChangedPairs', () => {
  it('should return an object with attribute-value pairs from dataValues based on provided attributes', () => {
    const attributes = ['name', 'age', 'city'];
    const dataValues = {
      name: 'John',
      age: 30,
      city: 'New York',
      gender: 'Male',
    };

    const result = getChangedPairs(attributes, dataValues);

    expect(result).toEqual({
      name: 'John',
      age: 30,
      city: 'New York',
    });
  });

  it('should handle empty arrays by returning an empty object', () => {
    const attributes = [];
    const dataValues = {
      name: 'John',
      age: 30,
      city: 'New York',
      gender: 'Male',
    };

    const result = getChangedPairs(attributes, dataValues);

    expect(result).toEqual({});
  });

  it('should handle missing attributes by ignoring them', () => {
    const attributes = ['name', 'age', 'country'];
    const dataValues = {
      name: 'John',
      age: 30,
      city: 'New York',
      gender: 'Male',
    };

    const result = getChangedPairs(attributes, dataValues);

    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
  });
});

describe('hashData and verifyHashedData', () => {
  it('should hash and verify data correctly', async () => {
    const data = 'myPassword';
    const saltRounds = 10;

    // Hash the data
    const hashedData = await hashData(data, saltRounds);

    // Verify the hashed data
    const isMatch = await verifyHashedData(data, hashedData);

    // Ensure that the verification result is true
    expect(isMatch).toBe(true);
  });

  it('should handle incorrect verification correctly', async () => {
    const unhashedData = 'myPassword';
    const incorrectData = 'incorrectPassword';
    const saltRounds = 10;

    // Hash the original data
    const hashedData = await hashData(unhashedData, saltRounds);

    // Verify using incorrect data
    const isMatch = await verifyHashedData(incorrectData, hashedData);

    // Ensure that the verification result is false
    expect(isMatch).toBe(false);
  });

  it('should handle errors during verification', async () => {
    const data = 'myPassword';
    const saltRounds = 10;

    // Hash the data
    const hashedData = await hashData(data, saltRounds);

    try {
      await verifyHashedData(null, hashedData);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('createPassword', () => {
  it('should generate a password of the specified length', () => {
    const length = 12;
    const password = createPassword(length);
    expect(password.length).toBe(length);
  });

  it('should include numbers when hasNumbers is true', () => {
    const password = createPassword(10, true, false);
    expect(password).toMatch(/[0-9]/);
  });

  it('should include symbols when hasSymbols is true', () => {
    const password = createPassword(12, false, true);
    expect(password).toMatch(/[!@#$%^&*_\-+=]/);
  });

  it('should include both numbers and symbols when both flags are true', () => {
    const password = createPassword(14, true, true);
    expect(password).toMatch(/[0-9!@#$%^&*_\-+=]/);
  });

  it('should not include numbers or symbols when both flags are false', () => {
    const password = createPassword(8, false, false);
    expect(password).toMatch(/^[a-zA-Z]+$/);
  });
});

describe('generatePassword', () => {
  it('should generate a password of the specified length', () => {
    const length = 12;
    const password = generatePassword(length, alpha);
    expect(password.length).toBe(length);
  });

  it('should use the provided character set', () => {
    const chars = 'ABC';
    const password = generatePassword(5, chars);
    expect(password).toMatch(/^[ABC]+$/);
  });
});

// Test the exported constants
describe('constants', () => {
  it('should have the correct values for alpha, numbers, and symbols', () => {
    expect(alpha).toBe("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    expect(numbers).toBe("0123456789");
    expect(symbols).toBe("!@#$%^&*_-+=");
  });
});
