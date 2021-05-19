# External plugin API

## Principles

- It must be absolutely isolated within the Mask Network extension.
- Developers should be able to develop a working plugin without acquiring "licence" or any form of agreement from the Mask team.
- It must not harm the data or property (wallet) safety.

## General design

An external plugin should be an isolated website, which means it should not be loaded or installed onto the Mask Network.

When Mask Network detects the metadata of an external plugin, it will try to fetch the manifest and display the content in the payload.
This process **must not** involve dynamic code execution.

When the user decides to interact with the external plugin, Mask Network will open a popup window and inject some APIs to it.

It is the same when user wants to use the external plugin when composing.

## User story

### Composing with external plugin

#### Discover the plugin

- If the user has used this plugin before, Mask will display it directly.

- If the user knows the plugin URL, they can manually add it.

- Users can explore plugins in a "external plugin collection", aka Masket Place.

#### Composing

After selecting the plugin, a popup window will appear.
If Mask Network has no permission to the plugin site, Mask Network will jump to a permission granting page first.

After permissions granted, the plugin page will appear.

User interacts with the plugin.

The plugin sends its payload back to the composition UI and the popup dialog closes.

### Seeing external plugin posted by others

User sees the plugin UI rendered by the Mask Network. Partial info, such as on-chain info, can be displayed directly on the card.

User clicks on the post card to interact with the plugin.

A popup window appears.
If Mask Network has no permission to the plugin site,
Mask Network will jump to a permission granting page first.
After permissions granted, the plugin page will appear.

User interacts with the plugin.

## Technical details

### Plugin definition

A plugin should be deployed on a static HTTPs URL, for example <https://example.com/my-plugin>, let's call it _base url_.

It should provide a manifest file called "mask-plugin-manifest.json".
For the example above, it should be located at <https://example.com/my-plugin/mask-plugin-manifest.json>.
It should also be in JSONC (JSON with comment) format.

The manifest file should match the following shape:

```typescript
interface ExternalPluginManifestFile {
  manifest_version: 1
  name: string
  publisher: string
  description: string
  code_sign: URL
  integrity?: Record<URL, string>
  i18n?: Record<Language, URL>
  metadata?: Record<PayloadMetadataKey, MetadataDetail>
  contribution?: {
    composition?: {
      target: URL | string
      icon: string | URL
    }
  }
}

interface MetadataDetail {
  // points to the JSON schema to validate if it is valid
  schema?: URL
  preview?: URL
}
```

Here is an example:

```jsonc
{
  "manifest_version": 1,
  // this will look for "name" in the current i18n language
  // If you don't want to do i18n, "name": "My plugin name" is also OK
  "name": "__locales:name",
  "description": "__locales:description",
  "publisher": "__locales:publisher",
  // Sign this manifest file so people will trust me (if my GPG key is famous)!
  // If you want to sign other resources, add it to the integrity list below
  // DISCUSS: I think it's better to have users to sign by their Mask account, aka ECC key pair.
  "code_sign": "./sign.gpg",
  "integrity": {
    // I can provide hash to enforce security
    // Opt-in feature.
    "./preview/kind1.html": "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
    // Now with sign.gpg and this hash, we can make sure ./preview/Card_1.json is trustable
  },
  "i18n": {
    "en": "./en.json",
    "zh": "./zh.json",
    "ja": "./ja.json"
  },
  "metadata": {
    // In Mask it will be plugin:example.com/my-plugin:kind:1
    "kind1:1": {
      "schema": "./kind1-v1.schema.json",
      "preview": "./preview/kind1.html"
    }
  },
  "contribution": {
    // This allows to add a new badge in
    // the composition dialog once user added the plugin
    "composition": {
      "icon": "./badge.svg",
      "target": "./compose.html"
    }
  }
}
```

### i18n

i18n files should follow the i18next format.

### Permissions

You might notice that there is no permission in the manifest because all permissions are designed to be requested dynamically.

### The "payload_preview" part

To avoid code execution in the Mask Network extension itself and still render a plugin UI,
we can provide some common templates allowing developers to interpolate with.

Here is an example of `./preview/kind1.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      <mask-card caption="From localhost!" button="Details" href="http://localhost:4242/entry?id={{payload.data.0}}">
        <i18n-translate slot="title" key="title">
          This is preview of id <span slot="id0">{{payload.data.0}}</span> and
          <span slot="id1">{{payload.data.1}}</span>
        </i18n-translate>
        Child content
      </mask-card>
    </template>
  </body>
</html>
```

### API in popups

The Mask plugin will only provide a JSON RPC based on EventTarget. The client should import a SDK file that wraps the RPC to the programmer friendly API.
