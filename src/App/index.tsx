import "./App.css";
import { ReportProvider } from "../ReportContext";

import { ReportControls } from "../ReportControls";
import { ReportChart } from "../ReportChart";
import { ReportDataTable } from "../ReportDataTable";
import logo from "./../Assets/logo.png";

import "./App.css";

function App() {
  return (
    <ReportProvider>
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
                <div className="header-report">
                  <img className="logo-img" src={logo} alt="logo"></img>
                </div>
                <ReportChart />
                <ReportDataTable />
                <div className="container">
                  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                      <a
                        href="/"
                        className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
                      >
                        <svg className="bi" width="30" height="24">
                          <use />
                        </svg>
                      </a>
                      <span className="text-muted">
                        &copy; {new Date().getFullYear()} Inteccon Colombia, SAS
                      </span>
                    </div>

                    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                      <li className="ms-3">
                        <a className="text-muted" href={"###"}>
                          <svg className="bi" width="24" height="24">
                            <use />
                          </svg>
                        </a>
                      </li>
                      <li className="ms-3">
                        <a className="text-muted" href={"##"}>
                          <svg className="bi" width="24" height="24">
                            <use />
                          </svg>
                        </a>
                      </li>
                      <li className="ms-3">
                        <a className="text-muted" href={"##"}>
                          <svg className="bi" width="24" height="24">
                            <use />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </footer>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ReportProvider>
  );
}

export default App;
