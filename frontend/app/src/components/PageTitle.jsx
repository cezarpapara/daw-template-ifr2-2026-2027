// Exercitiul 3: titlul unei pagini, cu un subtitlu optional
export default function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </>
  )
}
