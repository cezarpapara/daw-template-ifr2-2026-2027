// Componentă reutilizabilă: primește datele prin props și le afișează.
// {children} (exercițiul ★) permite să punem orice conținut sub text,
// de exemplu un buton: <Card ...><button>Detalii</button></Card>
export default function Card({ title, text, image, imageAlt = '', children }) {
  return (
    <article className="info-card">
      {image && (
        <img className="info-card-image" src={image} alt={imageAlt} />
      )}
      <h2 className="info-card-title">{title}</h2>
      <p>{text}</p>
      {children}
    </article>
  )
}
