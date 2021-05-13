/* globals describe it expect */

import {authenticateUser} from '../../../src/modules/users/controller'
import UserTest from './testRoutes'

const usertest = new.UserTest() 

describe( 'userAuthentication tests', () => {
    it.only('Should throw error when not passing user e-mail', async () => {
        const response = usertest.authenticateUser()
        
    })

    it('Should throw error when not passing token', async () => {


    })

    it('Should throw error when token is expired', async () => {

    })

    it('Should authenticate user when email and token are correct', async () => {

    })

})