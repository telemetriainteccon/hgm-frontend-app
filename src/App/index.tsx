import "./App.css";

import { ReportControls } from "../ReportControls";
import { ReportChart } from "../ReportChart";
import { ReportDataTable } from "../ReportDataTable";
import { ReportDataTable2 } from "../ReportDataTable2";
// import logo from "./../Assets/logo.png";
import { ReportContext } from "../ReportContext";

import "./App.css";
import { useContext } from "react";

function App() {
  const cx = useContext(ReportContext);
  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href={"###"}>
          Monitor Telemetría Inteccon
        </a>
      </header>

      <div className="container-fluid">
        <div className="row">
          <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4">
            <ReportControls />
            <div className="report-container">
              <div className="report-container-export">
                {/* <div className="header-report">
                  <img className="logo-img" src={logo} alt="logo"></img>
                </div> */}
                {cx.state.reportType === 1 ? (
                  <>
                    <ReportChart />
                    <ReportDataTable />
                  </>
                ) : (
                  <>
                    {/* <ReportChart /> */}
                    <ReportDataTable2></ReportDataTable2>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
