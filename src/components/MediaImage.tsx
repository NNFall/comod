import type { ComponentPropsWithoutRef } from 'react'

import { getMediaById, type MediaId } from '../content/mediaManifest'

type NativeImageProps = Omit<
  ComponentPropsWithoutRef<'img'>,
  'alt' | 'height' | 'src' | 'width'
>

export interface MediaImageProps extends NativeImageProps {
  readonly mediaId: MediaId
  readonly alt: string
}

export function MediaImage({
  mediaId,
  alt,
  decoding = 'async',
  ...imageProps
}: MediaImageProps) {
  const media = getMediaById(mediaId)

  return (
    <img
      {...imageProps}
      src={media.src}
      alt={alt}
      width={media.width}
      height={media.height}
      decoding={decoding}
      data-media-id={media.id}
      data-media-kind={media.kind}
      data-media-source={media.sourceUrl ?? media.sourceLabel}
      data-media-documentary={String(media.documentary)}
      data-media-recorded-on={media.recordedOn}
      data-media-rights={media.rightsStatus}
    />
  )
}
