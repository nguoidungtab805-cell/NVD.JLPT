// FILE: lib/parsers/fileParser.ts
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParseResult<T> {
  data: T[];
  errors: string[];
}

// Hàm Parse chung cho Excel và CSV
export const parseVocabularyFile = async (file: File): Promise<ParseResult<any>> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true, // Lấy dòng đầu tiên làm key
        skipEmptyLines: true,
        complete: (results) => {
          resolve({ data: results.data, errors: [] });
        },
        error: (error: any) => {
          resolve({ data: [], errors: [error.message] });
        }
      });
    });
  } 
  
  if (extension === 'xlsx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve({ data: json, errors: [] });
        } catch (error: any) {
          resolve({ data: [], errors: ["Lỗi đọc file Excel: " + error.message] });
        }
      };
      reader.onerror = () => resolve({ data: [], errors: ["Lỗi FileReader"] });
      reader.readAsArrayBuffer(file);
    });
  }

  // Tương lai có thể thêm mammoth để parse DOCX
  return { data: [], errors: ["Định dạng file không được hỗ trợ. Vui lòng dùng CSV hoặc XLSX."] };
};
