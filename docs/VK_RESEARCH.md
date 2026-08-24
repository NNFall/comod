# VK research and visual filtering log

Research date: **24 August 2026**.

## Access conclusion

Direct managed navigation to `https://vk.ru/komod_samara` was attempted and returned a non-retryable browser error. It was not treated as a successful review, and the investigation did not retry through unmanaged Playwright/CDP after that safety boundary.

A search-indexed public mirror, <https://komod-samara.orgs.biz/>, was opened in the managed in-app browser. Its visible page, news pages and image attributes were inspected. The mirror exposed 2026 post text, exact `vk.com/club118960395?w=wall-118960395_…` permalinks and `userapi.com` image assets. This establishes a **VK-origin via public mirror** chain; it is not equivalent to directly opening the VK group or VK post DOM.

## What was parsed

- More than 20 candidate images were inventoried and visually filtered across the mirror landing/news pages and userapi assets.
- The 5 March 2026 post page exposed `wall-118960395_3540`; one neutral 1706×2560 cup frame was accepted only for a clearly dated/archive event in the private prototype.
- The 5 January 2026 post page exposed `wall-118960395_3515`; one 1440×1920 snowy storefront frame was retained as immutable research evidence but rejected for production.
- Other 2026 mirror posts were useful only for understanding tone and activity. They were not promoted to current menu, event, offer, opening-hours or availability claims.

Exact post pages, VK permalinks, userapi URLs, dimensions and hashes for both research inputs are recorded in `source-assets/vk-mirror-2026-08-24/README.md`. Only the accepted cup frame is present in the typed production media manifest.

## Visual selection

Accepted for the private production manifest:

1. `vk-chicory-cups-2026-03-05.jpg` — clean high-resolution vertical ambience image with no identifiable people. It is reserved for a clearly dated/archive event; the historical post does not prove chicory or any recipe is currently available.

Rejected or retained only for visual research:

- staff/team frames, because people-consent and publication rights are not documented and they were unnecessary for the design;
- `vk-winter-storefront-2026-01-05.jpg`, because the seasonal arch, door notice, old hours and promotional poster can misrepresent the current facade; the immutable file remains in the research pack but has no production copy or manifest entry;
- older gallery images delivered only at roughly 200 px and newer food thumbnails around 400 px, because resolution was insufficient for the target 1672×941 desktop composition;
- duplicate crops and visually weaker frames;
- frames whose primary value was a time-sensitive offer or menu claim;
- other seasonal images as evidence of a permanent appearance.

## Metadata and truthfulness boundaries

- The mirror's top bar showed the legacy/conflicting address `Костюкова, 69`. It was rejected. The site's current address continues to come from the directly opened Yandex organisation card: Галактионовская улица, 130.
- A mirror is not authoritative for current facts. Post dates and text are archived context only.
- The accepted cup JPEG is an unchanged documentary original, but its commercial rights are still `owner-approval-required`; the rejected storefront is equally rights-gated as research material.
- Any later crop, colour grade, background removal or AI-assisted edit must preserve these originals, receive a new `documentary-derived` ID and disclose the transformation.
- Synthetic scenes must never be presented as documentary photos of Комод.

## Publication gate

The repository and site remain a private prototype. Before any public commercial deployment, the owner/rightsholder must approve every selected Yandex-origin or VK-origin photo, website publication, crops and any AI-derived versions. Direct VK access or an owner-provided export would improve the provenance chain but would not by itself replace the rights approval requirement.
