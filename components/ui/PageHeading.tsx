export default function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-gray-600">{description}</p>
      ) : null}
    </div>
  );
}
