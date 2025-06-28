export function GradientHeader({
  text,
  center = false,
}:{
  text: string
  center?: boolean;
}) {
  return <h2 className={`block font-bold text-[1.5rem] gradient-text ${center ? 'mx-auto' : ''}`}>{text}</h2>
}
