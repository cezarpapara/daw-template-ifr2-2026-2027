// Exercițiul 3: componentă pentru titlul unei pagini (h1 + subtitlu)
export default function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </>
  )
}
