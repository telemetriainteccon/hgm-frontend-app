import React, { useCallback, useContext, useEffect, useState } from "react";
import "./ReportControls.css";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import exportingImg from "./../Assets/exporting.gif";

import { ReportContext } from "../ReportContext";
import { ReportMmaService } from "../Services/reportMma.service";
import sensors from "./../labels.json";

function ReportControls() {
  const {
    setData,
    sensorId,
    setSensorId,
    minDate,
    setMinDate,
    maxDate,
    setMaxDate,
    setIsLoading,
    setError,
    setSensorText,
  } = useContext(ReportContext);

  const [isExporting, setIsExporting] = useState(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    setError(false);
    setData([]);

    try {
      new ReportMmaService()
        .getReporMma(sensorId, minDate, maxDate)
        .then((result: any) => {
          setIsLoading(false);
          setData(result);
        })
        .catch((error) => {
          setIsLoading(false);
          setError(error.toString());
          setData([]);
        });
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setData([]);
    }
  }, [sensorId, minDate, maxDate, setData, setIsLoading, setError]);

  useEffect(() => {
    getData();
  }, [sensorId, minDate, maxDate, getData]);

  const sensorList = sensors.map((sensor, index) => (
    <option key={index} value={sensor.id}>
      {sensor.name}
    </option>
  ));

  async function exportChartToPdf() {
    setIsExporting(true);
    setTimeout(async () => {
      const doc = new jsPDF("p", "px", "a4");
      const elements: any = document.getElementsByClassName(
        "report-container-export"
      );
      await creatPdf({ doc, elements });
      doc.setFontSize(40);
      doc.save(`reporte.pdf`);
      setIsExporting(false);
    }, 3000);
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

  return (
    <React.Fragment>
      {isExporting && (
        <div>
          <div className="exporting"></div>
          <div className="exporting-content">
            <img width={350} src={exportingImg} alt="Exporting"></img>
            <p>
              <b>Exportando PDF!</b>
            </p>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Reporte Invima</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => exportChartToPdf()}
              disabled={sensorId === 0}
            >
              Exportar
            </button>
            <select
              className="selSensors"
              onChange={(el) => {
                setSensorText(el.target.options[el.target.selectedIndex].text);
                setSensorId(parseInt(el.target.value));
              }}
            >
              {sensorList}
            </select>

            <input
              onChange={(el) =>
                setMinDate(
                  new Date(new Date(el.target.value).setHours(24)).toISOString()
                )
              }
              type="date"
              id="start"
              name="min-date"
              value={minDate.substring(0, 10)}
              max={maxDate.substring(0, 10)}
              min={new Date(
                new Date(maxDate).setDate(new Date(maxDate).getDate() - 31)
              )
                .toISOString()
                .substring(0, 10)}
            />
            <input
              onChange={(el) =>
                setMaxDate(
                  new Date(new Date(el.target.value).setHours(24)).toISOString()
                )
              }
              type="date"
              id="end"
              name="max-date"
              value={maxDate.substring(0, 10)}
              min={minDate.substring(0, 10)}
              max={new Date(
                new Date().setDate(new Date(minDate).getDate() + 31)
              )
                .toISOString()
                .substring(0, 10)}
            ></input>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { ReportControls };
