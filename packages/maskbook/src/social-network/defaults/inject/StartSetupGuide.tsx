import type { PersonaIdentifier } from '../../../database/type'
import { createReactRootShadowed } from '../../../utils/shadow-root/renderInShadowRoot'
import Services from '../../../extension/service'
import { ValueRef } from '@dimensiondev/holoflows-kit'
import { SetupGuide, SetupGuideProps } from '../../../components/InjectedComponents/SetupGuide'
import { Flags } from '../../../utils/flags'

function UI({ unmount, persona }: { unmount: () => void; persona: PersonaIdentifier } & Partial<SetupGuideProps>) {
    return <SetupGuide persona={persona} onClose={unmount} />
}

export function createTaskStartSetupGuideDefault(networkIdentifier: string, props: Partial<SetupGuideProps> = {}) {
    let shadowRoot: ShadowRoot
    return (signal: AbortSignal, for_: PersonaIdentifier) => {
        const dom = document.createElement('span')
        document.body.appendChild(dom)
        const provePost = new ValueRef('')
        const root = createReactRootShadowed(
            shadowRoot || (shadowRoot = dom.attachShadow({ mode: Flags.using_ShadowDOM_attach_mode })),
            { signal },
        )
        root.render(<UI persona={for_} unmount={() => root.destory()} />)
        Services.Crypto.getMyProveBio(for_, networkIdentifier)
            .then((x) => x || '')
            .then((x) => (provePost.value = x))
    }
}
