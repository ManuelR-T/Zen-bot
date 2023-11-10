import { describe, expect, test } from 'bun:test'

import { isMirrorTime } from '../../src/utils'

describe('Mirror Time Tests', () => {
  test('isMirrorTime True', () => {
    const mockedDate = new Date(1650046800000)
    expect(isMirrorTime(mockedDate)).toBe(true)
  })

  test('isMirrorTime True not perfect', () => {
    const mockedDate = new Date(1650046800001)
    expect(isMirrorTime(mockedDate)).toBe(true)
  })

  test('isMirrorTime False', () => {
    const mockedDate = new Date(1650046700000)
    expect(isMirrorTime(mockedDate)).toBe(false)
  })
})
