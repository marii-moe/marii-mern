import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Link extends Component {

  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div className='flex mt2 items-start'>
	<div className="flex items-center">
	  <span className='gray'>{this.props.index + 1}.</span>
	  {userId && <div data-button='vote' className='ml1 gray fl1' onClick={() => this._voteForLink()}>▲</div>}
	</div>
	<div className='ml1'>
	  <div>{this.props.link.description} ({this.props.link.url})</div>
	  <div className='f6 lh-copy gray'>
	    {this.props.link.votes.length} votes | by { this.props.link.postedBy.name } {timeDifferenceForDate(this.props.link.createdAt)}
	  </div>
	</div>
      </div>
    )
  }

  _voteForLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID)
    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    const linkId = this.props.link.id
    if(voterIds.includes(userId)) {
      console.log('User already voted for this link')
      return
    }
    await this.props.createVoteMutation({
      variables: {
	linkId
      },
      update: this.props.updateStoreAfterVote
    })
  }  
}

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($linkId: ID!) {
    createVote(linkId: $linkId) {
      id
      link {
        id
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
`

export { Link as _Link }

export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Link)
