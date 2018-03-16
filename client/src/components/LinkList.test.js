import React from 'react'
import LinkList from './LinkList'
import { _LinkList } from './LinkList' 
import { apolloRender } from '../Mock-Apollo'
import { shallow } from 'enzyme'

const params = {params:{page:1}}
const location =  {pathname: 'new'}
const links = {allLinks: {links: [{ id: 1, url: 'http://test.com', description: 'test', votes:[] }] }}

it('should render', async () => {
  expect(apolloRender(<LinkList
		      match={params}
		      location={location}
		      />)).toMatchSnapshot()
})

it('should update on new votes', async () => {
  const newVote={data: {Vote: {node: {link:{id: 1, votes: [{id: 1}]}}}}}
  let updateVoteQuery = {}
  links.subscribeToMore = (updateData) => {
    updateVoteQuery=updateData.updateQuery
  }
  const listWrapper = shallow(<_LinkList
			      location={location}
			      match={params}
			      allLinksQuery={links}
			      />)
  const newLinkList = updateVoteQuery(links,{subscriptionData: newVote})
  const resultVote = newLinkList.allLinks.links[0].votes[0]
  expect(resultVote.id).toEqual(1)
})

it('should update on new links', async () => {
  const newLink={data: {Link: {node: { id: 1 }}}}
  let updateLinkQuery = {}
  links.subscribeToMore = (updateData) => {
    const subscriptionName = updateData.document.definitions[0].selectionSet.selections[0].name.value
    if(subscriptionName=='Link')
      updateLinkQuery=updateData.updateQuery
  }
  const listWrapper = shallow(<_LinkList
			      location={location}
			      match={params}
			      allLinksQuery={links}
			      />)
  const newLinkList = updateLinkQuery(links,{subscriptionData: newLink})
  const resultLink = newLinkList.allLinks.links[0]
  expect(resultLink.id).toEqual(1)
})

it('should update the link cache', async () => {
  const listWrapper = shallow(<_LinkList
			      location={location}
			      match={params}
			      allLinksQuery={links}
			      />)
  console.log(listWrapper.root.context())
})
