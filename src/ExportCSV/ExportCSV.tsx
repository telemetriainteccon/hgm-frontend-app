import React from "react";
// import { Button } from "react-bootstrap";
import FileSaver from "file-saver";
import XLSX from "xlsx";

const ExportCSV = ({ csvData, fileName, wscols }: any) => {
  // ******** XLSX with new header *************
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const Heading = [
    {
      ColumnA: "Fecha",
      columnB: "Fecha_hora_max",
      columnC: "Valor_max",
      columnD: "Fecha_hora_min",
      columnE: "Valor_min",
      columnF: "Fecha_hora_max_am",
      columnG: "Valor_max_am",
      columnH: "Fecha_hora_min_am",
      columnI: "Valor_min_am",
      columnJ: "Fecha_hora_max_pm",
      columnK: "Valor_max_pm",
      columnL: "Fecha_hora_min_pm",
      columnM: "Valor_min_pm",
      columnN: "Promedio",
    },
  ];

  const exportToCSV = (csvData: any, fileName: any, wscols: any) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      skipHeader: true,
    });
    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_json(ws, csvData, {
      skipHeader: true,
      origin: -1, //ok
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className="btn btn-sm btn-primary"
      onClick={(e) => exportToCSV(csvData, fileName, wscols)}
    >
      Exportar
    </button>
  );
};

export default ExportCSV;

// This component is a presentational component which takes the data to download and file name as props. The exportToCSV method is invoked when the export button is clicked on line 20.
