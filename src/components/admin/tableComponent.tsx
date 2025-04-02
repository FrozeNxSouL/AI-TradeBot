
interface TableProps<T> {
  data: T[];
  columns: (keyof T)[];
}

export default function TableComponent<T>({ data, columns }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={String(col)} className="border border-gray-300 px-4 py-2">
                {String(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={String(col)} className="border border-gray-300 px-4 py-2">
                  {Array.isArray(item[col]) ? JSON.stringify(item[col]) : String(item[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
