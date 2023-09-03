import { isMirrorTime } from "../../src/utils";
// This will reset all mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Mirror Time Tests', () => {
  test('isMirrorTime True', () => {
    const mockedDate = new Date(1650046800000)
    expect(isMirrorTime(mockedDate)).toBe(true)
  })

  test('isMirorTime True not perfect', () => {
    const mockedDate = new Date(1650046800001)
    expect(isMirrorTime(mockedDate)).toBe(true)
  })

  test('isMirorTime False', () => {
    const mockedDate = new Date(1650046700000)
    expect(isMirrorTime(mockedDate)).toBe(false)
  })
})
