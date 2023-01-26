import React, { useState, CSSProperties, useContext } from "react";
import { Menu } from "./menu";
import { ReportContext } from "../ReportContext";
import { ReportsService } from "../Services/reports.service";
import loadingGif from "../Assets/loading.gif";

import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  } as CSSProperties,
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  } as CSSProperties,
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  } as CSSProperties,
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  } as CSSProperties,
  zoneHover: {
    borderColor: GREY_DIM,
  } as CSSProperties,
  default: {
    borderColor: GREY,
  } as CSSProperties,
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  } as CSSProperties,
};

export default function CSVReader() {
  const [isLoading, setIsLoading] = useState(false);
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const [data, setData] = useState([]);
  const cx = useContext(ReportContext);

  async function loadData(sensorId: number, dropletId: number) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Esta seguro de cargar el archivo?") === true) {
      setIsLoading(true);
      new ReportsService()
        .loadData(
          sensorId,
          dropletId,
          cx.state.minDate,
          data.filter((_, i) => i !== 0)
        )
        .then((result: any) => {
          setIsLoading(false);
          alert("Archivo cargado exitosamente");
          cx.onCompleted({ data: result });
        })
        .catch((error) => {
          setIsLoading(false);
          cx.onError();
        });
    } else {
    }
  }

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href={"###"}>
          Carga de Datos
        </a>
      </header>
      <div className="container-fluid">
        <div className="row">
          <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4">
            <Menu loadData={loadData} />
            <div className="report-container">
              {isLoading && (
                <div>
                  <img src={loadingGif} alt="loading"></img>
                  <br></br>
                  <label
                    style={{
                      marginRight: 5,
                      paddingBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Cargando datos...{" "}
                  </label>
                </div>
              )}
              <div className="report-container-export">
                <CSVReader
                  onUploadAccepted={(results: any) => {
                    console.log("---------------------------");
                    console.log(results);
                    console.log("---------------------------");
                    setData(results.data);
                    setZoneHover(false);
                  }}
                  onDragOver={(event: DragEvent) => {
                    event.preventDefault();
                    setZoneHover(true);
                  }}
                  onDragLeave={(event: DragEvent) => {
                    event.preventDefault();
                    setZoneHover(false);
                  }}
                  noDrag
                >
                  {({
                    getRootProps,
                    acceptedFile,
                    ProgressBar,
                    getRemoveFileProps,
                    Remove,
                  }: any) => (
                    <>
                      <div
                        {...getRootProps()}
                        style={Object.assign(
                          {},
                          styles.zone,
                          zoneHover && styles.zoneHover
                        )}
                      >
                        {acceptedFile ? (
                          <>
                            <div style={styles.file}>
                              <div style={styles.info}>
                                <span style={styles.size}>
                                  {formatFileSize(acceptedFile.size)}
                                </span>
                                <span style={styles.name}>
                                  {acceptedFile.name}
                                </span>
                              </div>
                              <div style={styles.progressBar}>
                                <ProgressBar />
                              </div>
                              <div
                                {...getRemoveFileProps()}
                                style={styles.remove}
                                onMouseOver={(event: Event) => {
                                  event.preventDefault();
                                  setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                }}
                                onMouseOut={(event: Event) => {
                                  event.preventDefault();
                                  setRemoveHoverColor(
                                    DEFAULT_REMOVE_HOVER_COLOR
                                  );
                                }}
                              >
                                <Remove color={removeHoverColor} />
                              </div>
                            </div>
                          </>
                        ) : (
                          "Click para seleccionar archivo"
                        )}
                      </div>
                    </>
                  )}
                </CSVReader>

                <table
                  className="report-table table-bordered table-responsive"
                  style={{ paddingBottom: 100 }}
                >
                  <thead>
                    {data
                      .filter((x, i) => i === 0)
                      .map((j) => (
                        <tr>
                          <th style={{ width: 150 }}>{j[0]}</th>
                          <th>{j[1]}</th>
                          <th>{j[2]}</th>
                        </tr>
                      ))}
                  </thead>
                  <tbody>
                    {data
                      .filter((x, i) => i > 0)
                      .map((j) => (
                        <tr>
                          <td>{j[0]}</td>
                          <td>{j[1]}</td>
                          <td>{j[2]}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
