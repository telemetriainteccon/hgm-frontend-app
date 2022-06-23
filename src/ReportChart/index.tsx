import React, { useContext, useEffect, useState } from "react";
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
  const cx = useContext(ReportContext);

  const [chartData, setChartData] = useState(defaultData);

  const loadChart = () => {
    const dates = cx.state.data
      .map((item: any) => item.date.substr(0, 2))
      .reduce(
        (acum: string, v: number, i: number) =>
          acum + `${acum !== "" ? "," : ""}${v.toString()}, `,
        ""
      )
      .split(",");

    const mmax = cx.state.data.map((item: any) => parseFloat(item.m.max));
    const mmean = cx.state.data.map((item: any) => parseFloat(item.m.mean));
    const mmin = cx.state.data.map((item: any) => parseFloat(item.m.min));
    const tmax = cx.state.data.map((item: any) => parseFloat(item.t.max));
    const tmean = cx.state.data.map((item: any) => parseFloat(item.t.mean));
    const tmin = cx.state.data.map((item: any) => parseFloat(item.t.min));

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
  };

  useEffect(() => {
    if (cx.state.data.length !== 0) {
      loadChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cx.state.data]);

  return (
    <React.Fragment>
      <section className="chart" id="chart">
        {cx.state.error && (
          <p className="alert-message">
            <b>Lo sentimos se ha presentado un error {cx.state.error} </b>
          </p>
        )}
        {cx.state.isLoading && (
          <div className="loading">
            <LoadingChart></LoadingChart>
          </div>
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
            <Line height={125} width={400} options={options} data={chartData} />
          </div>
        )}
      </section>
    </React.Fragment>
  );
}
