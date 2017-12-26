import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID, LINKS_PER_PAGE } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'

class CreateLink  extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
	<div className='flex flex-column mt3'>
	  <input
	    name='description'
	    className='mb2'
	    value={this.state.description}
	    onChange={(event) => this.setState({ description: event.target.value })}
	    type='text'
	    placeholder='A description for the link'
	    />
	    <input
	      name='url'
	      className='mb2'
	      value={this.state.url}
	      onChange={(event) => this.setState({ url: event.target.value })}
	      type='text'
	      placeholder='The URL for the link'
	      />
	</div>
	<button onClick={() => this._createLink()} >
	  Submit
	</button>
      </div>
    )
  }

  _createLink = async () => {
    const postedById = localStorage.getItem(GC_USER_ID)
    const { description, url } = this.state
    await this.props.createLinkMutation({
      variables: {
	description,
	url,
      },
      update: this._updateStoreWithLink
    })
    this.props.history.push(`/new/1`)
  }

  _updateStoreWithLink = (store, { data: {createLink } }) => {
    const first = LINKS_PER_PAGE
    const skip = 0
    const data = store.readQuery({
      query: ALL_LINKS_QUERY,
      variables: { first, skip}
    })
    data.allLinks.links.splice(0,0,createLink)
    if(data.allLinks.links.length > first)
      data.allLinks.links.pop()
    store.writeQuery({
      query: ALL_LINKS_QUERY,
      data,
      variables: { first, skip, }
    })
  }
}

export { CreateLink as _CreateLink }

const CREATE_LINK_MUTATION = gql`
mutation CreateLinkMutation($description: String!, $url: String!) {
  createLink(
    description: $description,
    url: $url
  ) {
    id
    #missing createdAt
    url
    description
    postedBy {
      id
      name
    }
  }
}
`

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
