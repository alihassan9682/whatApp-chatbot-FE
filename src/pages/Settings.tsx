import React, { useState, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MessageModal from '../components/messagesModal';
import DefaultLayout from '../layout/DefaultLayout';
import { parseCSV, parseExcel, generateJSON } from './helpers';

const Settings = () => {
  const [data, setData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState([]);
  const [textBoxes, setTextBoxes] = useState(['']);
  const maxPageNumbersToShow = 5;
  const tableRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    if (fileType === 'text/csv') {
      parseCSV(file, (result) => {
        setData(result);
        const json = generateJSON(result);
        setJsonData(json);
        scrollToTable();
      });
    } else if (
      fileType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      parseExcel(file, (result) => {
        setData(result);
        const json = generateJSON(result);
        setJsonData(json);
        scrollToTable();
      });
    } else {
      alert('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };

  const handleAddTextBox = () => {
    setTextBoxes([...textBoxes, '']);
  };

  const handleTextBoxChange = (index, value) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = value;
    setTextBoxes(newTextBoxes);
  };

  const handleRemoveTextBox = (index) => {
    const newTextBoxes = textBoxes.filter((_, i) => i !== index);
    setTextBoxes(newTextBoxes);
  };

  const sendJsonToApi = () => {
    setIsSending(true);
    setShowModal(true);
    setModalMessage(['Sending messages, please wait...', 'close']);

    fetch('http://127.0.0.1:8000/send_bulk_messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        details: jsonData,
        texts: textBoxes.filter((text) => text !== ''), // Include non-empty text boxes
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setModalMessage(['Messages sent successfully!', 'done']);
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setModalMessage('Error sending messages.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow + 1, indexOfLastRow + 1); // Adjusting slice to skip header
  const totalPages = Math.ceil((data.length - 1) / rowsPerPage); // Adjusting total pages calculation

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationGroup = () => {
    let start =
      Math.floor((currentPage - 1) / maxPageNumbersToShow) *
      maxPageNumbersToShow;
    return new Array(Math.min(maxPageNumbersToShow, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  return (
    <DefaultLayout>
      <div className="w-full">
        <Breadcrumb pageName="Settings" />
        <div className="">
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Upload File
                </h3>
              </div>
              <div className="p-7">
                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-green-500 bg-gray-100 py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3 text-green-500 ">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-green-600 dark:bg-stone-800 ">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="lightgreen"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54444 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.862 5.80478L7.99999 2.9428L5.13799 5.80478C4.87764 6.06513 4.45552 6.06513 4.19518 5.80478C3.93483 5.54444 3.93483 5.12232 4.19518 4.86197L7.5286 1.52864Z"
                          fill="lightgreen"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 2.66671C8.36786 2.66671 8.66634 2.96519 8.66634 3.33337V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V3.33337C7.33301 2.96519 7.63148 2.66671 7.99967 2.66671Z"
                          fill="lightgreen"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-green-500">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1.5">CSV or Excel files</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {textBoxes.map((textBox, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <textarea
                        value={textBox}
                        onChange={(e) =>
                          handleTextBoxChange(index, e.target.value)
                        }
                        placeholder="Type a message"
                        className="flex-grow p-2 border rounded-md border-dashed focus:outline-none border-green-600 focus:border-2 focus:border-solid "
                      />
                      <button
                        onClick={() => handleRemoveTextBox(index)}
                        className="py-0.5 px-3 text-red-600 border-2 border-dashed border-red-600 rounded-full text-lg font-bold"
                      >
                        -
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <button
                    onClick={handleAddTextBox}
                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                  >
                    Add a new message box
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={sendJsonToApi}
                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                    disabled={isSending}
                  >
                    Send Messages
                  </button>
                </div>
              </div>
            </div>

            {data.length > 1 && ( // Ensure there is more than just the header row
              <div
                ref={tableRef}
                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6"
              >
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Uploaded Data
                  </h3>
                </div>
                <div className="p-7 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-meta-4">
                        {data[0].map((header, index) => (
                          <th
                            key={index}
                            className="border border-stroke px-4 py-2 text-sm font-medium text-gray-700 dark:border-strokedark dark:text-white"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={`${
                            rowIndex % 2 === 0
                              ? 'bg-white dark:bg-boxdark'
                              : 'bg-gray-50 dark:bg-meta-4'
                          }`}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="border border-stroke px-4 py-2 text-sm text-gray-700 dark:border-strokedark dark:text-white"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4 mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`py-1 px-3 mx-1 bg-green-600 text-white`}
                  >
                    Previous
                  </button>
                  {getPaginationGroup().map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(item)}
                      className={`py-1 px-3 mx-1 ${
                        currentPage === item
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`py-1 px-3 mx-1 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MessageModal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </DefaultLayout>
  );
};

export default Settings;
