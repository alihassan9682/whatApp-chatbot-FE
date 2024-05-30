import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const parseCSV = (file, callback) => {
  Papa.parse(file, {
    complete: (result) => {
      callback(result.data);
    },
  });
};

export const parseExcel = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const bstr = event.target.result;
    const workbook = XLSX.read(bstr, { type: 'binary' });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    callback(jsonData);
  };
  reader.readAsBinaryString(file);
};

export const generateJSON = (data) => {
  const headers = data[0];
  const rows = data.slice(1);
  const jsonArray = rows.map((row) => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return jsonArray;
};
