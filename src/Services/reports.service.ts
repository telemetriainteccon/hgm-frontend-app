import axios from "axios";

class ReportsService {
  getReporMma(
    sensorId: number,
    minDateISO: string,
    maxDateISO: string,
    type: string
  ) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          // `http://192.241.153.89:3001
          `http://192.241.153.89:3001/api/v1/reports/report-mma/${sensorId}?minDate=${minDateISO}&maxDate=${maxDateISO}&type=${type}`
        )
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
