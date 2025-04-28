# JMeter Performance Test Instructions

## Setup Instructions

1. **Install Apache JMeter**
   - Version **5.5 or later** is recommended.
   - [Download JMeter](https://jmeter.apache.org/download_jmeter.cgi)

2. **Load the Provided Test Plans**
   - Open JMeter and load the following `.jmx` files:
     - `100 concurrent users logging in.jmx`
     - `FundTransfer.jmx`

3. **Configure JMeter Properties (Optional)**
   - Increase heap size (`-Xms`, `-Xmx`) if planning to run large load tests.
   - Edit the `jmeter.bat` (Windows) or `jmeter` (Unix) startup script as needed.

---

## How to Execute the Tests

1. **Start JMeter**.

2. **Open the Desired Test Plan**
   - Go to `File` → `Open` → Select the `.jmx` file.

3. **Adjust Thread Group Settings** (if needed)
   - Configure:
     - Number of Threads (Users)
     - Ramp-Up Time
     - Loop Count

4. **Add Necessary Listeners**
   - Recommended listeners:
     - Aggregate Report
     - View Results in Table
     - View Results Tree (for debugging)

5. **Start the Test**
   - Click the **Start** button (green triangle).

6. **Analyze the Results**
   - View using listeners inside JMeter.
   - Optionally generate an **HTML Dashboard Report** for detailed analysis.

---

## Challenges Faced and Solutions

| Challenge | Solution |
|-----------|----------|
| **Missing Parameters in Requests** | Corrected the HTTP Request paths to avoid HTML encoding issues (e.g., properly handling special characters like `&`). |
| **Server Errors Under Load** | Reduced initial user load to identify the breaking point, then gradually increased the load. |
| **Unstable Response Times** | Introduced "think time" between user actions to simulate real-world user behavior. |
| **Insufficient Monitoring** | Added server-side monitoring tools and integrated additional JMeter listeners for enhanced visibility. |
| **High Error Rates During Ramp-Up** | Increased ramp-up time in Thread Group settings to allow servers to handle the user load more smoothly. |

---

## Additional Notes

- Always monitor both client-side (JMeter) and server-side (server metrics) during load testing.
- Start with a smaller user load to validate scripts before running full-scale tests.
- Add appropriate assertions to validate response data and ensure functional correctness under load.
