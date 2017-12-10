import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import React, { Component } from 'react'
import Link from './Link'
import { LINKS_PER_PAGE } from '../constants'

class LinkList extends Component {
  
  render() {
    if(this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }
    if(this.props.allLinksQuery && this.props.allLinksQuery.error) {
      return <div>Error</div>
    }
    const isNewPage = this.props.location.pathname.includes('new')
    const linksToRender = this._getLinksToRender(isNewPage)
    const page = parseInt(this.props.match.params.page, 10)
    return (
      <div>
	<div>
	  {linksToRender.map((link, index) => (
	    <Link key={link.id}
		  index={page ? (page-1) * LINKS_PER_PAGE + index : index}
		  link={link}
		  updateStoreAfterVote={this._updateCacheAfterVote}
		  /> 
	  ))}
      </div>
	{isNewPage &&
	 <div className='flex ml4 mv3 gray'>
	 <div className='pointer mr2' onClick={() => this._previousPage()}>Previous</div>
	 <div className='pointer' onClick={() => this._nextPage()}>Next</div>
	 </div>
	}
	</div>
    )
  }
  _getLinksToRender = (isNewPage) => {
    if (isNewPage) {
      return this.props.allLinksQuery.allLinks
    }
    const rankedLinks = this.props.allLinksQuery.allLinks.slice()
    rankedLinks.sort((l1, l2) => l2.votes.lengt - l1.votes.length)
    return rankedLinks
  }

  _nextPage = () => {
    console.log('tet')
    const page = parseInt(this.props.match.params.page, 10)
    const nextPage = page +1
    this.props.history.push(`/new/${nextPage}`)
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if(page > 1) {
      const previousPage = page -1
      this.props.history.push(`/new/${previousPage}`)
    }
  }
  
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page -1)* LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const data = store.readQuery({ query: ALL_LINKS_QUERY, variables: { first, skip } })
    const votedLink = data.allLinks.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }
  _subscribeToNewLinks = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Link(filter: {
            mutation_in: [CREATED]
          }) {
            node {
              id
              url
              description
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
	const newAllLinks = [
	  subscriptionData.data.Link.node,
	  ...previous.allLinks
	]
	const result = {
	  ...previous,
	  allLinks: newAllLinks
	}
	return result
      }
    })
  }
  _subscribeToNewVotes = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql `
        subscription {
          Vote(filter: {
            mutation_in: [CREATED]
          }) {
            node {
              id
              link {
                id
                url
                description
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id 
                 }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
	const votedLinkIndex = previous.allLinks.findIndex(
	  link => link.id === subscriptionData.data.Vote.node.link.id)
	const link = subscriptionData.data.Vote.node.link
	const newAllLinks = previous.allLinks.slice()
	newAllLinks[votedLinkIndex] = link
	const result = {
	  ...previous,
	  allLinks: newAllLinks
	}
	return result
      },
    })
  }
  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
  }

}

export const ALL_LINKS_QUERY = gql`
query AllLinksQuery($first: Int, $skip: Int) {
  allLinks(first: $first, skip: $skip) {
    id
#miss    createdAt
    url
    description
    postedBy {
      id
      name
    }
    votes {
      id
      user { 
        id
      }
    }
  }
}
`

export default graphql(ALL_LINKS_QUERY, {
  name: 'allLinksQuery',
  options: (ownProps) => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? LINKS_PER_PAGE*(page-1): 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    return {
      variables: { first, skip }
    }
  }
}) (LinkList)
