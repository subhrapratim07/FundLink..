import { ReportHandler } from 'web-vitals';

// This function sends the metrics to the console or to a server
const reportWebVitals = (metric) => {
  console.log(metric);  // You can replace this with sending metrics to an analytics service
};

export default reportWebVitals;
