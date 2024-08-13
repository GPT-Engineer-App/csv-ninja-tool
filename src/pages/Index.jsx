import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
        toast({
          title: "CSV Uploaded",
          description: `Successfully loaded ${results.data.length - 1} rows of data.`,
        });
      },
      header: false,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCellEdit = (rowIndex, columnIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][columnIndex] = value;
    setCsvData(newData);
  };

  const addNewRow = () => {
    const newRow = new Array(headers.length).fill('');
    setCsvData([...csvData, newRow]);
    toast({
      title: "Row Added",
      description: "A new row has been added to the CSV.",
    });
  };

  const deleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
    toast({
      title: "Row Deleted",
      description: "The selected row has been removed from the CSV.",
      variant: "destructive",
    });
  };

  const downloadCSV = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast({
      title: "CSV Downloaded",
      description: "Your edited CSV file has been downloaded.",
    });
  };

  return (
    <div className="container mx-auto p-4 mt-4 bg-gray-900 text-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-100">CSV Editor</h1>
      </motion.div>
      
      <motion.div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-12 mb-8 text-center cursor-pointer bg-gray-800 hover:bg-gray-700 transition duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-gray-300">Drop the CSV file here ...</p>
        ) : (
          <p className="text-lg text-gray-300">Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </motion.div>

      {csvData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <Table>
                <thead className="bg-gray-700">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {csvData.map((row, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                      className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                          <Input
                            value={cell}
                            onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="destructive" size="sm" onClick={() => deleteRow(rowIndex)} className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button onClick={addNewRow} className="mr-2 bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Row
            </Button>
            <Button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;