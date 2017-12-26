import { BrowserRouter } from 'react-router-dom' 
import React from 'react'
import Header from './Header'
import { GC_USER_ID,GC_AUTH_TOKEN } from '../constants'
import { mount } from 'enzyme'
it('can log out', () => {
  let setStorageCount = 0;
  localStorage.getItem = () => { return 1 }
  localStorage.removeItem = () => { setStorageCount++ }
  const wrapper = mount(<BrowserRouter><Header /></BrowserRouter>)
  const logoutButton = wrapper.find('#logout')
  logoutButton.simulate('click')
  expect(setStorageCount>1).toBe(true)
})
