import React, { useCallback, useContext, useEffect, useState } from "react";
import { LoadingChart } from "../ReportChart/LoadingChart";
import { ReportContext } from "../ReportContext";
import noResult from "./../Assets/no-results.jpg";
import "./ReportDataTable2.css";

function ReportDataTable2() {
  const cx = useContext(ReportContext);
  const [table, setTable] = useState(<></>);

  const loadTable = useCallback(() => {
    const result = (
      <table
        className="report-table table-bordered table-responsive"
        style={{ paddingBottom: 100 }}
      >
        <thead>
          <tr>
            <th className="lighCyan">Fecha</th>

            <th className="lighYellow">Fecha y hora max</th>
            <th className="lighYellow">Valor max</th>
            <th className="lighYellow">Fecha y hora min</th>
            <th className="lighYellow">Valor min</th>

            <th className="lighCyan">Fecha y hora max am</th>
            <th className="lighCyan">Valor max am</th>
            <th className="lighCyan">Fecha y hora min am</th>
            <th className="lighCyan">Valor min am</th>

            <th className="lighYellow">Fecha y Hora max pm</th>
            <th className="lighYellow">Valor max pm</th>
            <th className="lighYellow">Fecha y Hora min pm</th>
            <th className="lighYellow">Valor min pm</th>

            <th className="lighCyan">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {cx.state.data.map((item: any) => (
            <tr>
              <th className="lighCyan">{item.date}</th>

              <td className="lighYellow">{item.f.timeMax}</td>
              <td className="lighYellow">{item.f.max}</td>
              <td className="lighYellow">{item.f.timeMin}</td>
              <td className="lighYellow">{item.f.min}</td>

              <td className="lighCyan">{item.m.timeMax}</td>
              <td className="lighCyan">{item.m.max}</td>
              <td className="lighCyan">{item.m.timeMin}</td>
              <td className="lighCyan">{item.m.min}</td>

              <td className="lighYellow">{item.t.timeMax}</td>
              <td className="lighYellow">{item.t.max}</td>
              <td className="lighYellow">{item.t.timeMin}</td>
              <td className="lighYellow">{item.t.min}</td>

              <th className="lighCyan">{item.f.mean}</th>
            </tr>
          ))}
        </tbody>
      </table>
    );

    setTable(<div className="tables-result">{result}</div>);
  }, [cx.state.data, setTable]);

  useEffect(() => {
    if (cx.state.data.length !== 0) {
      loadTable();
    }
  }, [cx.state.data, loadTable]);

  return (
    <React.Fragment>
      <section className="chart" id="chart">
        {cx.state.error && (
          <p className="alert-message">
            <b>Lo sentimos se ha presentado un error {cx.state.error} </b>
          </p>
        )}
        {cx.state.isLoading && (
          <div className="loading">{<LoadingChart></LoadingChart>}</div>
        )}
        {cx.state.sensorId === 0 && !cx.state.isLoading && !cx.state.error && (
          <div>
            <img width={200} src={noResult} alt="No Results"></img>
            <p className="alert-message">
              <b>Aun no has seleccionado un área </b>
            </p>
          </div>
        )}
        {cx.state.sensorId !== 0 && cx.state.data.length !== 0 && (
          <div>
            <div className="report-title">
              <h5>
                {cx.state.sensorText}{" "}
                {cx.state.sensorType === "T" ? "TEMPERATURA" : "HUMEDAD"}
              </h5>
              <label>
                <b>Organización:</b> HOSPITAL GENERAL DE MEDELLÍN <b>Año:</b>{" "}
                {new Date().getFullYear()}
              </label>
            </div>
            <section>
              {cx.state.data.length !== 0 && cx.state.sensorId !== 0 && (
                <div>{table}</div>
              )}
            </section>
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

export { ReportDataTable2 };
