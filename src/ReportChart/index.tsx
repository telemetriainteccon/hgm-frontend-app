import React, { useCallback, useContext, useEffect, useState } from "react";
import { ReportContext } from "../ReportContext";
import "./ReportChart.css";

import noResult from "./../Assets/no-results.jpg";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LoadingChart } from "./LoadingChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

const labels = [""];

export const defaultData = {
  labels,
  datasets: [
    {
      label: "",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export function ReportChart() {
  const { data, isLoading, error, sensorId, sensorText } =
    useContext(ReportContext);
  const [chartData, setChartData] = useState(defaultData);

  const loadChart = useCallback(() => {
    const dates = data.data
      .map((item: any) => item.date.substr(0, 2))
      .reduce(
        (acum: string, v: number, i: number) =>
          acum + `${acum !== "" ? "," : ""}${v.toString()}, `,
        ""
      )
      .split(",");

    const mmax = data.data.map((item: any) => parseFloat(item.m.max));
    const mmean = data.data.map((item: any) => parseFloat(item.m.mean));
    const mmin = data.data.map((item: any) => parseFloat(item.m.min));
    const tmax = data.data.map((item: any) => parseFloat(item.t.max));
    const tmean = data.data.map((item: any) => parseFloat(item.t.mean));
    const tmin = data.data.map((item: any) => parseFloat(item.t.min));

    const max = mmax
      .reduce(
        (acum: string, v: number, i: number) =>
          acum +
          `${acum !== "" ? "," : ""}${v.toString()},${tmax[i].toString()}`,
        ""
      )
      .split(",");

    const mean = mmean
      .reduce(
        (acum: string, v: number, i: number) =>
          acum +
          `${acum !== "" ? "," : ""}${v.toString()},${tmean[i].toString()}`,
        ""
      )
      .split(",");
    const min = mmin
      .reduce(
        (acum: string, v: number, i: number) =>
          acum +
          `${acum !== "" ? "," : ""}${v.toString()},${tmin[i].toString()}`,
        ""
      )
      .split(",");

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Máxima",
          data: max.map((x: number) =>
            x.toString() === "-1" || x.toString() === "0" ? undefined : x
          ),
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          label: "Actual",
          data: mean.map((x: number) =>
            x.toString() === "-1" || x.toString() === "0" ? undefined : x
          ),
          borderColor: "black",
          backgroundColor: "black",
        },
        {
          label: "Mínima",
          data: min.map((x: number) =>
            x.toString() === "-1" || x.toString() === "0" ? undefined : x
          ),
          borderColor: "blue",
          backgroundColor: "blue",
        },
      ],
    });
  }, [data]);

  useEffect(() => {
    if (data.length !== 0) {
      loadChart();
    }
  }, [data, loadChart]);

  return (
    <React.Fragment>
      <section className="chart" id="chart">
        {error && <p className="alert-message"><b>Lo Sentimos se ha presentado un error {error} </b></p>}
        {isLoading && (
          <div className="loading">
            <LoadingChart></LoadingChart>
          </div>
        )}
        {sensorId === 0 && !isLoading && !error && (
          <div>
            <img width={300} src={noResult} alt="No Results"></img>
            <p className="alert-message"><b>Aun no has seleccionado un área </b></p>
          </div>
        )}
        {sensorId !== 0 && data.length !== 0 && (
          <div>
            <div className="report-title">
              <h5>{sensorText} TEMPERATURA</h5>
              <label>
                <b>Organización:</b> HOSPITAL GENERAL DE MEDELLÍN <b>Año:</b>{" "}
                {new Date().getFullYear()}
              </label>
            </div>
            <Line
              height={125}
              width={400}
              className="line"
              options={options}
              data={chartData}
            />
          </div>
        )}
      </section>
    </React.Fragment>
  );
}
