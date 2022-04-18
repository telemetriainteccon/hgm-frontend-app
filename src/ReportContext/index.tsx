import React, { useState } from "react";

// @ts-ignore
const ReportContext = React.createContext<any>();

function ReportProvider(props: any) {
  const [data, setData] = useState<string[]>([]);
  const [sensorId, setSensorId] = useState(0);
  const [sensorText, setSensorText] = useState("");
  const [minDate, setMinDate] = useState(
    new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(10)).toISOString()
  );
  const [maxDate, setMaxDate] = useState(
    new Date(new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).setHours(10)).toISOString()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <ReportContext.Provider
      value={{
        data,
        setData,
        sensorId,
        setSensorId,
        minDate,
        setMinDate,
        maxDate,
        setMaxDate,
        isLoading,
        setIsLoading,
        error,
        setError,
        sensorText,
        setSensorText,
      }}
    >
      {props.children}
    </ReportContext.Provider>
  );
}

export { ReportContext, ReportProvider };
