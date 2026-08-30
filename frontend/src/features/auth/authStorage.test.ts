import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest'

import {
    clearAccessToken,
    getAccessToken,
    setAccessToken,
} from './authStorage'

describe('authStorage', () => {

    beforeEach(() => {
        sessionStorage.clear()
    })

    it('stores the access token', () => {

        setAccessToken(
            'test-token',
        )

        expect(
            getAccessToken(),
        ).toBe(
            'test-token',
        )
    })

    it('clears the access token', () => {

        setAccessToken(
            'test-token',
        )

        clearAccessToken()

        expect(
            getAccessToken(),
        ).toBeNull()
    })
})