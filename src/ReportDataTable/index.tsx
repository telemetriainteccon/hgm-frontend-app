import React, { useCallback, useContext, useEffect, useState } from "react";
import { ReportContext } from "../ReportContext";
import "./ReportDataTable.css";

function ReportDataTable() {
  const { data, sensorId } = useContext(ReportContext);
  const [table, setTable] = useState(<></>);

  const loadTable = useCallback(() => {
    let tableMatrix = [];
    let tableArray = [];

    for (let index = 0; index < data.data.length; index++) {
      const element = data.data[index];

      if (index !== 0 && index % 10 === 0) {
        tableMatrix.push(tableArray.map((x) => x));
        tableArray = [];
      }

      tableArray.push(element);
    }

    if (tableArray.length !== 0) {
      tableMatrix.push(tableArray.map((x) => x));
    }

    const result = tableMatrix.map((items, index) => {
      return (
        <table key={index} className="report-table table-bordered table-responsive">
          <thead>
            <tr>
              <th>Fecha</th>
              {items.map((x: any) => (
                <th colSpan={2}>{x.date}</th>
              ))}
            </tr>
            <tr>
              <th>Temperatura</th>
              {items.map((x: any) => (
                <>
                  <th scope="col">M</th>
                  <th scope="col">T</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Maxima</th>
              {items
                .reduce(
                  (acum: string, v: any, i: number) =>
                    acum +
                    `${acum !== "" ? "," : ""}${v.m.max.toString()},${items[
                      i
                    ].t.max.toString()}`,
                  ""
                )
                .split(",")
                .map((x: any) => (
                  <td>{x}</td>
                ))}
            </tr>
            <tr>
              <th scope="row">Actual</th>
              {items
                .reduce(
                  (acum: string, v: any, i: number) =>
                    acum +
                    `${
                      acum !== "" ? "," : ""
                    }${v.m.mean.toString()},${items[i].t.mean.toString()}`,
                  ""
                )
                .split(",")
                .map((x: any) => (
                  <td>{x}</td>
                ))}
            </tr>
            <tr>
              <th scope="row">Minima</th>
              {items
                .reduce(
                  (acum: string, v: any, i: number) =>
                    acum +
                    `${acum !== "" ? "," : ""}${v.m.min.toString()},${items[
                      i
                    ].t.min.toString()}`,
                  ""
                )
                .split(",")
                .map((x: any) => (
                  <td>{x}</td>
                ))}
            </tr>
          </tbody>
        </table>
      );
    });

    setTable(<div className="tables-result">{result}</div>);
  }, [data, setTable]);

  useEffect(() => {
    if (data.length !== 0) {
      loadTable();
    }
  }, [data, loadTable]);

  return (
    <React.Fragment>
      <section>
        {/* {error && <label>Has Error!! {error}</label>} */}
        {/* {isLoading && <></>} */}
        {/* {!isLoading && !data && <label>Is Loading!!</label>} */}
        {data.length !== 0 && sensorId!==0 && table }
      </section>
    </React.Fragment>
  );
}

export { ReportDataTable };
