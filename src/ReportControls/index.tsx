import React, { useContext, useEffect } from "react";
import "./ReportControls.css";

import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import addDays from 'date-fns/addDays'

import exportingImg from "./../Assets/exporting.gif";
import { ReportContext } from "../ReportContext";
import { ReportMmaService } from "../Services/reportMma.service";
import sensors from "./../labels.json";

function ReportControls() {
  const cx = useContext(ReportContext);

  const getData = () => {
    if (cx.state.sensorId !== 0) {
      try {
        cx.onLoading();
        new ReportMmaService()
          .getReporMma(cx.state.sensorId, cx.state.minDate, cx.state.maxDate)
          .then((result) => {
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
  }, [cx.state.sensorId, cx.state.minDate, cx.state.maxDate]);

  const sensorList = sensors.map((sensor, index) => (
    <option key={index} value={sensor.id}>
      {sensor.name}
    </option>
  ));

  async function exportChartToPdf() {
    cx.onExporting();

    setTimeout(async () => {
      const doc = new jsPDF("p", "px", "a4");
      const elements: any = document.getElementsByClassName(
        "report-container-export"
      );
      await creatPdf({ doc, elements });
      doc.setFontSize(40);
      doc.save(`reporte.pdf`);

      cx.onCompleted();
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
      {cx.state.isExporting && (
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

            <input
              onChange={(el) => {
                return cx.onChange({
                  minDate: new Date(
                    new Date(el.target.value).setHours(24)
                  ).toISOString(),
                  maxDate: addDays(new Date(el.target.value).setHours(24), cx.state.dayRange).toISOString()
                });
              }}
              type="date"
              id="start"
              name="min-date"
              value={cx.state.minDate.substring(0, 10)}
              max={new Date().toISOString().substring(0, 10)}
            />
            <select
              defaultValue={cx.state.dayRange}
              className="selRange"
              onChange={(el) => {
                return cx.onChange({
                  maxDate: addDays(new Date(cx.state.minDate), parseInt(el.target.value)).toISOString(),
                  dayRange: parseInt(el.target.value)
                });
              }}
            >
              <option value={30}> Mensual </option>
              <option value={15}>Quincenal</option>
              <option value={7}>Semanal</option>
            </select>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => exportChartToPdf()}
              disabled={cx.state.sensorId === 0}
            >
              Exportar
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export { ReportControls };
