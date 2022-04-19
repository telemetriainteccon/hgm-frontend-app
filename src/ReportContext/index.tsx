import React from "react";

// @ts-ignore
const ReportContext = React.createContext<any>();

const initialState = {
  data: [],
  sensorId: 0,
  sensorText: "",
  dayRange: 30,
  minDate: new Date(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(10)
  ).toISOString(),
  maxDate: new Date(
    new Date(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(10)
    ).setDate(
      new Date(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(
          10
        )
      ).getDate() + 30
    )
  ).toISOString(),
  isLoading: false,
  isExporting: false,
  error: false,
};

const actionTypes = {
  empy: "EMPTY",
  change: "CHANGE",
  error: "ERROR",
  completed: "COMPLETED",
  loading: "LOADING",
  exporting: "EXPORTING",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.empy:
      return {
        ...state,
        data: [],
        error: false,
        loading: false,
        isExporting: false,
      };
    case actionTypes.change:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.error:
      return {
        ...state,
        data: [],
        error: true,
        isLoading: false,
        isExporting: false,
      };
    case actionTypes.completed:
      return {
        ...state,
        ...action.payload,
        error: false,
        isLoading: false,
        isExporting: false,
      };
    case actionTypes.loading:
      return {
        ...state,
        data: [],
        error: false,
        isLoading: true,
        isExporting: false,
      };
    case actionTypes.exporting:
      return {
        ...state,
        error: false,
        isLoading: false,
        isExporting: true,
      };
    default:
      return state;
  }
};

function ReportProvider(props: any) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <ReportContext.Provider
      value={{
        state,
        onEmpty: () => dispatch({ type: actionTypes.empy }),
        onLoading: () => dispatch({ type: actionTypes.loading }),
        onExporting: () => dispatch({ type: actionTypes.exporting }),
        onChange: (params: any) =>
          dispatch({
            type: actionTypes.change,
            payload: { ...params },
          }),
        onCompleted: (params: any) =>
          dispatch({ type: actionTypes.completed, payload: { ...params } }),
        onError: () => dispatch({ type: actionTypes.error }),
      }}
    >
      {props.children}
    </ReportContext.Provider>
  );
}

export { ReportContext, ReportProvider, actionTypes, reducer };
