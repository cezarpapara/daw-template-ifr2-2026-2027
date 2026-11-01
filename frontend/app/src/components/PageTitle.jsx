export default function PageTitle({ title, subtitle }) {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </>
  );
}