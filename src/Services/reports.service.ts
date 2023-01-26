import axios from "axios";

class ReportsService {
  server: string;
  constructor() {
    //this.server = "http://localhost:3001";
    this.server = "http://143.244.173.149:3001";
  }

  getReporMma(
    sensorId: number,
    minDateISO: string,
    maxDateISO: string,
    type: string
  ) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${this.server}/api/v1/reports/report-mma/${sensorId}?minDate=${minDateISO}&maxDate=${maxDateISO}&type=${type}`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  GetActiveServersBySensorId(sensorId: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.server}/api/v1/reports/servers/${sensorId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loadData(sensorId: number, dropletId: number, minDateISO: string, data: any) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.server}/api/v1/reports/loadData`, {
          sensorId,
          dropletId,
          minDateISO,
          data,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export { ReportsService };
