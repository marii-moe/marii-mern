import { ApolloProvider } from 'react-apollo'
import React from 'react';
import ReactDOM from 'react-dom';
import { _CreateLink }  from './CreateLink'
import CreateLink  from './CreateLink'
import { mockClient, apolloRender } from "../Mock-Apollo"
import { shallow } from 'enzyme'
import { LINKS_PER_PAGE } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'

it('renders successfully', async () => {
  localStorage.getItem = () => { return 1 }
  const div = document.createElement('div')
  const wrapper = apolloRender(<CreateLink/>)
  expect(wrapper).toMatchSnapshot()
})

it('redirects back to LinkList', async () => {
  const createLink = new _CreateLink()
  const createLinkMutationMock = () => { return true }
  const historyMock = []
  createLink.props = { client: mockClient,
		       history: historyMock,
		       createLinkMutation: createLinkMutationMock
		     }
  await createLink._createLink()
  expect(historyMock[0]).toEqual('/new/1')
})

it('updates the store', async () => {
  const createLink = new _CreateLink()
  const readQuery = jest.fn()
  const writeQuery = jest.fn()
  readQuery.mockReturnValue({allLinks: {links: []}})
  const store = { readQuery: readQuery, writeQuery: writeQuery }
  
  const links = {data: {createLink: { description: 'Mock link'} }}
  createLink._updateStoreWithLink( store , links)
  const writtenToStore = store.writeQuery.mock.calls[0][0].data.allLinks.links[0].description
  expect(writtenToStore).toEqual('Mock link')
})

it('submits a link', async () => {
  localStorage.getItem = () => { return 1 }
  const div = document.createElement('div')
  const wrapper = apolloRender(<CreateLink/>)
  const submitfunction = jest.fn()
  wrapper.instance()._createLink = submitfunction
  wrapper.find('button').simulate('click');
  expect(submitfunction.mock.calls.length).toEqual(1)
})

it('updates state when textboxes are updated', async () => {
  localStorage.getItem = () => { return 1 }
  const div = document.createElement('div')
  const wrapper = apolloRender(<CreateLink/>)
  wrapper.find('input').at(0).simulate('change', {target: {value: 'My new description'}});
  expect(wrapper.instance().state.description).toEqual('My new description')
  wrapper.find('input').at(1).simulate('change', {target: {value: 'My new link'}});
  expect(wrapper.instance().state.url).toEqual('My new link')
})

it('updates the store and removes link if over 5', async () => {
  const createLink = new _CreateLink()
  const readQuery = jest.fn()
  const writeQuery = jest.fn()
  readQuery.mockReturnValue({allLinks: {links: [{},{},{},{},{}]}})
  const store = { readQuery: readQuery, writeQuery: writeQuery }
  
  const links = {data: {createLink: { description: 'Mock link'} }}
  createLink._updateStoreWithLink( store , links)
  const writtenLinks = store.writeQuery.mock.calls[0][0].data.allLinks.links
  const writtenToStore = writtenLinks[0].description
  expect(writtenToStore).toEqual('Mock link')
  expect(writtenLinks.length).toEqual(5)
})

