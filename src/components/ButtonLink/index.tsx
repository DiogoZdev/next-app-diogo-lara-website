import clsx from "clsx";

type Variant = 'PRIMARY' | 'SECONDARY' | 'BLACK' | 'WHITE';

export function ButtonLink(props: {
  url: string;
  text: string;
  variant?: Variant;
}) {
  return (
    <button className={clsx('min-w-40 px-4 py-2 border-4 border-solid text-lg font-black', {
      'text-black border-black': props.variant === 'BLACK',
      'text-white border-white': props.variant === 'WHITE'
    })}>
      <a href={props.url} target="_blank">{props.text}</a>
    </button>
  )
}
