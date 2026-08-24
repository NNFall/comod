import { getMediaById, type MediaId } from '../content/mediaManifest'
import { yandexRouteUrl } from '../content/site'

const mapThumbnails = [
  { id: 'entrance-close', className: 'schematic-map__thumb--north-west' },
  { id: 'coffee-by-window', className: 'schematic-map__thumb--north-east' },
  { id: 'interior-wide', className: 'schematic-map__thumb--south-west' },
  { id: 'yellow-chair', className: 'schematic-map__thumb--south-east' },
] as const satisfies readonly { id: MediaId; className: string }[]

export function SchematicMap() {
  return (
    <a
      className="schematic-map"
      data-visual-guide="contacts-map"
      href={yandexRouteUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Схематическая карта к Комоду. Открыть точный маршрут в Яндекс Картах"
    >
      <svg viewBox="0 0 421 412" aria-hidden="true" focusable="false">
        <rect width="421" height="412" fill="#f0e0d1" />
        <rect
          x="32"
          y="20"
          width="352"
          height="360"
          fill="transparent"
          pointerEvents="none"
          data-map-geometry="primary-route"
        />
        <rect
          x="68"
          y="86"
          width="256"
          height="284"
          fill="transparent"
          pointerEvents="none"
          data-map-geometry="cross-route"
        />
        <path
          d="M32 20 C86 76 126 129 157 194 C197 278 275 319 384 380"
          fill="none"
          stroke="#fff9ef"
          strokeWidth="20"
          strokeLinecap="round"
          data-map-route="primary"
        />
        <path
          d="M68 370 C126 305 176 245 216 196 C255 147 289 111 324 86"
          fill="none"
          stroke="#fff9ef"
          strokeWidth="14"
          strokeLinecap="round"
          data-map-route="cross"
        />
        <path
          d="M5 221 C107 203 205 165 416 113"
          fill="none"
          stroke="#e6ccb2"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M43 397 C123 301 236 185 389 29"
          fill="none"
          stroke="#e6ccb2"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x="152" y="274" fill="#6c4a39" fontSize="12" transform="rotate(-31 152 274)">
          Галактионовская
        </text>
        <text x="238" y="142" fill="#7b5d4c" fontSize="10" transform="rotate(-43 238 142)">
          Красноармейская
        </text>
        <text x="96" y="338" fill="#7b5d4c" fontSize="10" transform="rotate(-39 96 338)">
          Вилоновская
        </text>
        <g data-map-pin transform="translate(196 114)">
          <path
            d="M35.5 82 C28 68 0 49 0 30 C0 13.4 15.9 0 35.5 0 C55.1 0 71 13.4 71 30 C71 49 43 68 35.5 82 Z"
            fill="#240f03"
          />
          <circle cx="35.5" cy="29" r="17" fill="#f78b00" />
          <path d="M27 22h17v14H27z" fill="none" stroke="#fff9ef" strokeWidth="3" />
          <path d="M27 29h17" stroke="#fff9ef" strokeWidth="3" />
        </g>
      </svg>

      {mapThumbnails.map(({ id, className }) => {
        const media = getMediaById(id)

        return (
          <img
            key={id}
            className={`schematic-map__thumb ${className}`}
            src={media.src}
            alt=""
            width={media.width}
            height={media.height}
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            data-map-thumb=""
            data-media-id={media.id}
            data-media-kind={media.kind}
            data-documentary={String(media.documentary)}
            data-media-source={media.sourceLabel}
          />
        )
      })}

      <span className="schematic-map__label">
        Схема · точный маршрут в Яндекс Картах
      </span>
    </a>
  )
}
