import React from 'react';

interface TableProps {
  data: any[];
  loading: boolean;
}

const TableThree: React.FC<TableProps> = ({ data, loading }) => {
  const renderHeader = () => {
    if (data.length === 0) return null;
    return (
      <tr className="bg-gray-2 text-left dark:bg-green-600">
        {Object.keys(data[0]).map((key, index) => (
          <th
            key={index}
            className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
          >
            {key}
          </th>
        ))}
      </tr>
    );
  };

  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    } else if (value === null || value === undefined) {
      return 'N/A';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return JSON.stringify(value);
    } else if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value.toString();
  };

  const renderBody = () => {
    return data.map((item, index) => (
      <tr key={index} className="hover:bg-slate-100">
        {Object.entries(item).map(([key, value], idx) => (
          <td
            key={idx}
            className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
          >
            <p className="text-black dark:text-white">{renderValue(value)}</p>
          </td>
        ))}
      </tr>
    ));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto ">
          <thead>{renderHeader()}</thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
