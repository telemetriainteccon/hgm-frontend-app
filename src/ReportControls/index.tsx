import React, { useContext, useEffect } from "react";
import "./ReportControls.css";

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import addDays from "date-fns/addDays";

import exportingImg from "./../Assets/exporting.gif";
import { ReportContext } from "../ReportContext";
import { ReportsService } from "../Services/reports.service";
import sensors from "../Assets/Files/labels.json";

import ExportCSV from "../ExportCSV/ExportCSV";
import { flatten } from "flat";

function ReportControls() {
  const cx = useContext(ReportContext);

  const getData = () => {
    if (cx.state.sensorId !== 0) {
      try {
        cx.onLoading();

        new ReportsService()
          .getReporMma(
            cx.state.sensorId,
            cx.state.minDate,
            cx.state.maxDate,
            cx.state.sensorType
          )
          .then((result: any) => {
            cx.onCompleted({ data: result });
          })
          .catch((error) => {
            cx.onError();
          });
      } catch (error) {
        cx.onError();
      }
    } else {
      cx.onEmpty();
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cx.state.sensorId,
    cx.state.minDate,
    cx.state.maxDate,
    cx.state.sensorType,
    cx.state.reportType,
  ]);

  const sensorList = sensors.map((sensor, index) => (
    <option key={index} value={sensor.id}>
      {sensor.name}
    </option>
  ));

  async function exportChartToPdf() {
    const doc = new jsPDF("p", "px", "a4");
    const elements: any = document.getElementsByClassName(
      "report-container-export"
    );
    await creatPdf({ doc, elements });
    doc.setFontSize(40);
    doc.save(`reporte.pdf`);
  }

  async function creatPdf({
    doc,
    elements,
  }: {
    doc: jsPDF;
    elements: HTMLCollectionOf<Element>;
  }) {
    let top = 20;
    const padding = 10;

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i) as HTMLElement;
      const imgData = await htmlToImage.toPng(el);

      let elHeight = el.offsetHeight;
      let elWidth = el.offsetWidth;

      const pageWidth = doc.internal.pageSize.getWidth();

      if (elWidth > pageWidth) {
        const ratio = pageWidth / elWidth;
        elHeight = elHeight * ratio - padding;
        elWidth = elWidth * ratio - padding;
      }

      const pageHeight = doc.internal.pageSize.getHeight();

      if (top + elHeight > pageHeight) {
        doc.addPage();
        top = 20;
      }

      doc.addImage(
        imgData,
        "PNG",
        padding,
        top,
        elWidth,
        elHeight,
        `image${i}`
      );
      top += elHeight;
    }
  }

  const wscols = [
    { wch: 10 },
    { wch: 25 },
    { wch: 10 },
    { wch: 25 },
    { wch: 10 },
    { wch: 25 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
  ];

  return (
    <React.Fragment>
      {cx.state.isExporting && (
        <div>
          <div className="exporting"></div>
          <div className="exporting-content">
            <img width={150} src={exportingImg} alt="Exporting"></img>
            <p>
              <b>Exportando PDF!</b>
            </p>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <label></label>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2" style={{ display: "inline" }}>
            <select
              defaultValue={cx.state.reportType}
              onChange={(el) => {
                return cx.onChange({
                  reportType: parseInt(el.target.value),
                });
              }}
            >
              <option value={1}>Reporte Gráfico 1</option>
              <option value={2}>Reporte 2</option>
            </select>
            <select
              className="selSensors"
              onChange={(el) =>
                cx.onChange({
                  sensorId: parseInt(el.target.value),
                  sensorText: el.target.options[el.target.selectedIndex].text,
                })
              }
            >
              {sensorList}
            </select>
            <select
              defaultValue={cx.state.sensorType}
              onChange={(el) => {
                return cx.onChange({
                  sensorType: el.target.value,
                });
              }}
            >
              <option value="T">Temperatura</option>
              <option value="H">Humedad</option>
            </select>
            <input
              onChange={(el) => {
                return cx.onChange({
                  minDate: new Date(
                    new Date(el.target.value).setHours(24)
                  ).toISOString(),
                  maxDate: addDays(
                    new Date(el.target.value).setHours(24),
                    cx.state.dayRange
                  ).toISOString(),
                });
              }}
              type="date"
              id="start"
              name="min-date"
              value={cx.state.minDate.substring(0, 10)}
              max={cx.state.maxDate.substring(0, 10)}
              style={{ height: 25 }}
            />
            <input
              onChange={(el) =>
                cx.onChange({
                  maxDate: new Date(
                    new Date(el.target.value).setHours(24)
                  ).toISOString(),
                })
              }
              type="date"
              id="end"
              name="max-date"
              value={cx.state.maxDate.substring(0, 10)}
              min={cx.state.minDate.substring(0, 10)}
              max={new Date(
                new Date().setDate(new Date(cx.state.minDate).getDate() + 31)
              )
                .toISOString()
                .substring(0, 10)}
              style={{ height: 25 }}
            ></input>
            <select
              defaultValue={cx.state.downloadType}
              onChange={(el) => {
                return cx.onChange({
                  downloadType: parseInt(el.target.value),
                });
              }}
            >
              <option value={1}>PDF</option>
              <option value={2}>Excel</option>
            </select>

            {cx.state.downloadType === 1 && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => exportChartToPdf()}
                disabled={cx.state.sensorId === 0}
              >
                Exportar
              </button>
            )}

            {cx.state.downloadType === 2 && (
              <>
                {/* <CSVLink
                  className="btn btn-sm btn-primary"
                  data={cx.state.data}
                  headers={cx.state.reportType === 1 ? headers : headers2}
                  filename={"reporte-invima.csv"}
                >
                  Exportar
                </CSVLink> */}
                <ExportCSV
                  csvData={cx.state.data.map((e: any) => {
                    const data: any = flatten(e);
                    return {
                      columnA: data["date"],
                      columnB: data["f.timeMax"],
                      columnC: data["f.max"],
                      columnD: data["f.timeMin"],
                      columnE: data["f.min"],
                      columnF: data["m.timeMax"],
                      columnG: data["m.max"],
                      columnH: data["m.timeMin"],
                      columnI: data["m.min"],
                      columnJ: data["t.timeMax"],
                      columnK: data["t.max"],
                      columnL: data["t.timeMin"],
                      columnM: data["t.min"],
                      columnN: data["f.mean"],
                    };
                  })}
                  fileName="ReporteMaxMin"
                  wscols={wscols}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { ReportControls };
