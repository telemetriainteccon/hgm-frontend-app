import axios from "axios";

class ReportMmaService {
  getReporMma(sensorId: number, minDateISO: string, maxDateISO: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `http://192.241.153.89:3001/api/v1/reports/report-mma/${sensorId}?minDate=${minDateISO}&maxDate=${maxDateISO}`
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

export { ReportMmaService };
