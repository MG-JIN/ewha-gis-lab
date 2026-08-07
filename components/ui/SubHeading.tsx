export default function SubHeading({ title }: { title: string }) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <h3 className="text-lg font-bold tracking-wide text-gray-900 uppercase sm:text-xl">
        {title}
      </h3>
      <span className="mt-3 h-0.5 w-12 rounded-full bg-ewha-green-700 sm:w-14" />
    </div>
  );
}
