import axios from 'axios';

const ZAP_API_KEY = 'your_zap_api_key';
const ZAP_ADDRESS = 'localhost';
const ZAP_PORT = '8080';
const TARGET = 'http://localhost:8000/login'; // Vaihda oman sovelluksesi kirjautumissivun osoite

async function startScan() {
    // Käynnistä skannaus
    const scanResp = await axios.get(
        `http://${ZAP_ADDRESS}:${ZAP_PORT}/JSON/ascan/action/scan/`, {
            params: {
                apikey: ZAP_API_KEY,
                url: TARGET
            }
        }
    );
    const scanId = scanResp.data.scan;
    console.log(`Skannaus aloitettu. Scan ID: ${scanId}`);

    // Odota skannauksen valmistumista
    let status = '0';
    while (status !== '100') {
        const statusResp = await axios.get(
            `http://${ZAP_ADDRESS}:${ZAP_PORT}/JSON/ascan/view/status/`, {
                params: { scanId }
            }
        );
        status = statusResp.data.status;
        console.log(`Skannaus käynnissä... ${status}% valmiina`);
        await new Promise(res => setTimeout(res, 5000));
    }
    console.log('Skannaus valmis!');

    // Hae löydetyt haavoittuvuudet
    const alertsResp = await axios.get(
        `http://${ZAP_ADDRESS}:${ZAP_PORT}/JSON/core/view/alerts/`, {
            params: { baseurl: TARGET }
        }
    );
    const alerts = alertsResp.data.alerts;
    alerts.forEach((alert: any) => {
        console.log(`Haavoittuvuus: ${alert.alert}, Vakavuus: ${alert.risk}, Kuvaus: ${alert.description}`);
    });
}

startScan().catch(console.error);
