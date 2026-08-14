export type UniqueValuesListI = {
  values: string[];
};

export default function UniqueValuesList({ values }: UniqueValuesListI) {
  if (values.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {values.map((value, idx) => (
        <span
          key={idx}
          className="inline-flex items-center rounded-16 bg-primary-50 px-8 py-2 text-m-regular text-primary-700 truncate max-w-full"
          title={value}
        >
          {value || "—"}
        </span>
      ))}
    </div>
  );
}
