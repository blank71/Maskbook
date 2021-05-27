import type { TypedMessage } from '../../../protocols/typed-message'
import { makeStyles } from '@material-ui/core'
import { renderWithRedPacketMetadata } from '../helpers'
import { RedPacketInPost } from './RedPacketInPost'

const useStyles = makeStyles((theme) => ({
    line: {
        padding: theme.spacing(1, 0),
    },
}))

export interface RedPacketInspectorProps extends withClasses<never> {
    message: TypedMessage
}

export function RedPacketInspector(props: RedPacketInspectorProps) {
    const { message } = props

    const jsx = message
        ? renderWithRedPacketMetadata(message.meta, (r) => {
              if (process.env.STORYBOOK) return null
              return <RedPacketInPost payload={r} />
          })
        : null
    return <>{jsx}</>
}
