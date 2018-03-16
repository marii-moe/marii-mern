import React from 'react'
import Link from './Link'
import { _Link } from './Link'
import { apolloRender } from '../Mock-Apollo'

const testLink = {
  description: 'test description',
  url: 'http://test.com',
  votes: [],
  postedBy: {
    name: 'test-user'
  }
}

it('should render', async () => {
  expect(apolloRender(<Link link={testLink} />)).toMatchSnapshot()
})

it('should allow users to vote', async () => {
  const link = new _Link()
  const createVoteMutation = jest.fn()
  link.props = {
    link: testLink,
    createVoteMutation: createVoteMutation
  }
  
  await link._voteForLink()
  expect(createVoteMutation.mock.calls.length).toEqual(1)
})

it('should not allow users to vote if already voted', async () => {
  const link = new _Link()
  const createVoteMutation = jest.fn()
  const votedTestLink = Object.assign(testLink, { votes: [{user: {id: 1}}]})
  link.props = {
    link: votedTestLink,
    createVoteMutation: createVoteMutation
  }
  global.localStorage.getItem = () => { return 1 }
  console.log = () => {} //suppress logs in test output
  await link._voteForLink()
  expect(createVoteMutation.mock.calls.length).toEqual(0)
})

it('should render', async () => {
  global.localStorage.getItem = () => { return 1 }
  const wrapper = apolloRender(<Link link={testLink} />)
  const createVote = jest.fn()
  wrapper.instance()._voteForLink = createVote
  wrapper.find('div[data-button="vote"]').simulate('click');
  expect(createVote.mock.calls.length).toEqual(1)
})
