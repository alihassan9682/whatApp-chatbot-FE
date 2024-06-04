import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import TableThree from '../components/Tables/TableThree';
import { Package } from '../types/chat';
import axios from 'axios';
import MessageModal from '../components/messagesModal';

const Chats = () => {
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://13.60.82.53/send_bulk_messages/',
        );
        setPackageData(response.data.detail);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProceed = async () => {
    setShowModal(true); // Show modal when proceeding
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/send_bulk_replies/',
      );
      console.log('Success:', response.data);
      // Handle the response data as needed
    } catch (err) {
      console.error('Error:', err);
      // Handle the error as needed
    } finally {
      setShowModal(false); // Hide modal after receiving response
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Available Chats" />
      <div className="mt-6">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-meta-4 p-4 rounded-t-lg">
          <div>
            <p className="text-lg font-semibold">
              To proceed auto conversation with the following contacts, press
              "Proceed".
            </p>
            <p className="text-sm text-red-600">
              Alternatively, you can archive these contacts on your phone to
              restrict auto conversation with them and refresh the page to get
              updated contacts.
            </p>
          </div>
          <button
            onClick={handleProceed}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg"
          >
            Proceed
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <TableThree data={packageData} loading={loading} />
      <MessageModal
        show={showModal}
        message={['Replying to selected unread chats......', 'close']}
      />
    </DefaultLayout>
  );
};

export default Chats;
