import type { SocialNetwork } from '../../social-network/types'
import { mindsBase } from './base'
import { usernameValidator } from './utils/user'

export const mindsShared: SocialNetwork.Shared & SocialNetwork.Base = {
    ...mindsBase,
    utils: {
        getHomePage: () => 'https://www.minds.com',
        isValidUsername: usernameValidator,
        publicKeyEncoding: undefined,
        textPayloadPostProcessor: undefined,
        getPostURL(post) {
            return new URL(`https://minds.com/newsfeed/${post.postId}`)
        },
        getShareLinkURL(message) {
            return new URL(`https://www.minds.com/newsfeed/subscriptions?intentUrl=${encodeURIComponent(message)}`)
        },
    },
}
