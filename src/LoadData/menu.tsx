import React, { useContext, useState } from "react";
import "./menu.css";

import addDays from "date-fns/addDays";

import { ReportContext } from "../ReportContext";
import { ReportsService } from "../Services/reports.service";
import sensors from "../Assets/Files/labels.json";

function Menu({ loadData }: any) {
  const cx = useContext(ReportContext);
  const [droplets, setDroplets] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDroplet, setSelectedDroplet] = useState(-1);

  const sensorList = sensors.map((sensor, index) => (
    <option key={index} value={sensor.id}>
      {sensor.name}
    </option>
  ));

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <label></label>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2" style={{ display: "inline" }}>
            <select
              value={selectedSensor}
              className="selSensors"
              onChange={(el) => {
                setSelectedSensor(parseInt(el.target.value));
                setIsLoading(true);
                new ReportsService()
                  .GetActiveServersBySensorId(el.target.value)
                  .then((result: any) => {
                    console.log(result);
                    if (result.length !== 0) setDroplets(result);

                    setSelectedDroplet(-1);
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                  });
              }}
            >
              {sensorList}
            </select>
            <select
              disabled={selectedSensor === 0 || isLoading}
              value={selectedDroplet}
              onChange={(el) => {
                setSelectedDroplet(parseInt(el.target.value));
              }}
            >
              <option value={-1}>Seleccionar Servidor</option>
              {droplets.map((x) => (
                <option value={x}>Droplet {x}</option>
              ))}
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
              disabled={
                selectedSensor === 0 || isLoading || selectedDroplet === -1
              }
            />
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={async () => {
                await loadData(selectedSensor, selectedDroplet);
              }}
              disabled={
                selectedSensor === 0 || isLoading || selectedDroplet === -1
              }
            >
              Cargar Datos
            </button>
          </div>
        </div>
      </div>
      {isLoading && (
        <label style={{ marginRight: 5, paddingBottom: 10 }}>Loading... </label>
      )}
    </React.Fragment>
  );
}

export { Menu };
